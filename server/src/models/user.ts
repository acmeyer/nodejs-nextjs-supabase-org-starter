import {Selectable, Insertable, Updateable} from 'kysely';
import {Users} from '../../db/types';
import { isCustomDomain, getOrganizationNameForDomain } from '../lib/helpers';
import { db } from '../../db/db';
import { InsertableOrganization, findOrganizationByDomain } from './organization';

export type User = Selectable<Users>;
export type InsertableUser = Insertable<Users>;
export type UpdateableUser = Updateable<Users>;

export const getUserById = async (userId: string) => {
  const user = await db
    .selectFrom('users')
    .where('users.id', '=', userId)
    .selectAll()
    .executeTakeFirst();
  return user;
};

export const updateUser = async (userId: string, user: UpdateableUser) => {
  const updatedUser = await db
    .updateTable('users')
    .set({
      ...user,
      updated_at: new Date(),
    })
    .where('id', '=', userId)
    .returningAll()
    .executeTakeFirst();
  return updatedUser;
};

export const getOrganizationsForUser = async (userId: string) => {
  const organizations = await db
    .selectFrom('users_organizations')
    .leftJoin('organizations', 'users_organizations.organization_id', 'organizations.id')
    .where('users_organizations.user_id', '=', userId)
    .select([
      'organizations.id',
      'organizations.name',
      'organizations.domain',
      'organizations.has_completed_onboarding',
      'organizations.completed_onboarding_at',
      'organizations.allows_email_domain_signup',
      'organizations.created_at',
      'organizations.updated_at'
    ])
    .execute();
  return organizations.map((org) => ({
    id: org.id,
    name: org.name,
    domain: org.domain,
    has_completed_onboarding: org.has_completed_onboarding,
    completed_onboarding_at: org.completed_onboarding_at,
    allows_email_domain_signup: org.allows_email_domain_signup,
    created_at: org.created_at,
    updated_at: org.updated_at,
  }));
};

export const findOrganizationForUser = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const email = user.email;
  const domain = email.split('@')[1];
  const isCustom = isCustomDomain(domain);
  if (isCustom) {
    const organization = await findOrganizationByDomain(domain);
    if (organization && organization.allows_email_domain_signup) {
      return organization;
    }
  }
  
  return null;
}

export const createPlaceholderOrganizationForUser = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const email = user.email;
  const domain = email.split('@')[1];
  const isCustom = isCustomDomain(domain);
  let orgData: InsertableOrganization = {
    name: `${email}'s Org`,
    domain: null,
  };
  if (isCustom) {
    orgData.name = getOrganizationNameForDomain(domain);
    orgData.domain = domain;
  }
  const organization = await db
    .insertInto('organizations')
    .values(orgData)
    .returning([
      'id',
      'name',
      'domain',
      'has_completed_onboarding',
      'completed_onboarding_at',
      'allows_email_domain_signup',
      'created_at',
      'updated_at'
    ])
    .executeTakeFirstOrThrow();
  await db
    .insertInto('users_organizations')
    .values({
      user_id: userId,
      organization_id: organization.id,
    })
    .execute();
  return organization;

};

export const getOnboardingOrganizationForUser = async (userId: string) => {
  let organization = await db
    .selectFrom('users_organizations')
    .leftJoin('organizations', 'users_organizations.organization_id', 'organizations.id')
    .where('users_organizations.user_id', '=', userId)
    .select([
      'organizations.id',
      'organizations.name',
      'organizations.domain',
      'organizations.has_completed_onboarding',
      'organizations.completed_onboarding_at',
      'organizations.allows_email_domain_signup',
      'organizations.created_at',
      'organizations.updated_at'
    ])
    .executeTakeFirst(); // assume only one org for now

  if (!organization) {
    // If they don't have an organization, try to see if there's an existing one to attach them to
    let organization = await findOrganizationForUser(userId);
    // If there's no existing organization, create a placeholder one
    if (!organization) {
      organization = await createPlaceholderOrganizationForUser(userId);
    }
  }

  return organization;
};