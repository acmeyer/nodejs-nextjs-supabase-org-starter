import {Selectable, Insertable, Updateable} from 'kysely';
import {Organizations} from '../../db/types';
import { db } from '../../db/db';
import { supabase } from '../lib/supabase';
import { User } from './user';

export type Organization = Selectable<Organizations>;
export type InsertableOrganization = Insertable<Organizations>;
export type UpdateableOrganization = Updateable<Organizations>;

export const getOrganizationById = async (orgId: string) => {
  const organization = await db
    .selectFrom('organizations')
    .where('id', '=', orgId)
    .selectAll()
    .executeTakeFirst();
  return organization;
};

export const findOrganizationByDomain = async (domain: string) => {
  const organization = await db
    .selectFrom('organizations')
    .where('domain', '=', domain)
    .selectAll()
    .executeTakeFirst();
  return organization;
};

export const updateOrganization = async (orgId: string, organization: UpdateableOrganization) => {
  const updatedOrganization = await db
    .updateTable('organizations')
    .set({
      ...organization,
      updated_at: new Date(),
    })
    .where('id', '=', orgId)
    .returningAll()
    .executeTakeFirst();
  return updatedOrganization;
}

export const inviteOrganizationMembers = async (orgId: string, user: User, teamEmails: string) => {
  const emails = teamEmails.split(',');
  const trimmedEmails = emails.map(email => email.trim());

  const invitePromises = trimmedEmails.map(email => {
    return supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        invited_by: user.email,
        organization_id: orgId,
      },
    });
  });

  await Promise.all(invitePromises);
}