import OnboardingSteps from "./OnboardingSteps";
import { User } from "../../../server/src/models/user";
import { Organization } from "../../../server/src/models/organization";

export default function OrganizationSignUp({
  user,
  organization,
}: {
  user: User;
  organization: Organization;
}) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-lg sm:border border-gray-200 dark:border-zinc-700 sm:p-10 rounded-lg">
      <div className="">
        <img
          className="h-10 w-auto"
          src="logo.svg"
          alt="Logo"
        />
      </div>

      <OnboardingSteps user={user} organization={organization} />
    </div>
  )
};