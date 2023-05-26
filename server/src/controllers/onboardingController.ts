import { NextFunction, Request, Response } from 'express';
import { 
  getUserById, 
  updateUser,
  getOnboardingOrganizationForUser,
} from '../models/user';
import { getOrganizationById, inviteOrganizationMembers, updateOrganization } from '../models/organization';

export const setupUserOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [user, onboardingOrganization] = await Promise.all([
      getUserById(req.user.id),
      getOnboardingOrganizationForUser(req.user.id),
    ]);

    return res.status(200).json({
      success: true,
      user,
      onboardingOrganization,
    });
  } catch (error: any) {
    next(error);
  }
};

export const completeOrganizationOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, organization } = req.body;

    const [updatedUser, updatedOnboardingOrg] = await Promise.all([
      updateUser(user.id, user),
      updateOrganization(organization.id, organization),
    ]);

    return res.status(200).json({
      success: true,
      user: updatedUser,
      onboardingOrganization: updatedOnboardingOrg,
    });
  } catch (error: any) {
    next(error);
  }
};

export const completeOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamEmails, organizationId } = req.body;

    if (teamEmails && teamEmails !== '') {
      await inviteOrganizationMembers(organizationId, req.user.id, teamEmails);
    }

    const organization = await getOrganizationById(organizationId);
    // If the organization has already completed onboarding, return
    if (organization?.has_completed_onboarding) {
      return res.status(200).json({
        success: true,
      });
    }

    await updateOrganization(organizationId, {
      has_completed_onboarding: true,
      completed_onboarding_at: new Date(),
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
};
