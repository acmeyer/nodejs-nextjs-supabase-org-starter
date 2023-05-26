'use client'

import { useState } from "react";
import CollectOrganizationInformationStep from "./CollectOrganizationInformationStep";
import InviteTeamStep from "./InviteTeamStep";
import { User } from "../../../server/src/models/user";
import { Organization } from "../../../server/src/models/organization";

export default function OnboardingSteps({
  user,
  organization,
}: {
  user: User;
  organization: Organization;
}) {
  const [step, setStep] = useState(0);

  return (
    <div className="w-full max-w-md px-2 py-8 sm:px-0">
      <nav className="flex items-center justify-start" aria-label="Progress">
        <ol role="list" className="flex items-center space-x-5">
          <li>
            {step === 0 ? (
              <div className="relative flex items-center justify-center" aria-current="step">
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span className="h-full w-full rounded-full bg-indigo-200" />
                </span>
                <span className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                <span className="sr-only">Organization Details</span>
              </div>
            ) : (
              <div onClick={() => setStep(0)} className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:cursor-pointer">
                <span className="sr-only">Organization Details</span>
              </div>
            )}
          </li>
          <li>
            {step === 1 ? (
              <div className="relative flex items-center justify-center" aria-current="step">
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span className="h-full w-full rounded-full bg-indigo-200" />
                </span>
                <span className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                <span className="sr-only">Invite Team</span>
              </div>
            ) : (
              <div className="block h-2.5 w-2.5 rounded-full bg-gray-200">
                <span className="sr-only">Invite Team</span>
              </div>
            )}
          </li>
        </ol>
      </nav>
      <div>
        {step === 0 ? (
          <CollectOrganizationInformationStep user={user} organization={organization} onComplete={() => setStep(1)} />
        ) : (
          <InviteTeamStep user={user} organization={organization} />
        )}
      </div>
    </div>
  )
}