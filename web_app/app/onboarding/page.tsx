import { API_SERVER_URL } from "@/lib/constants";
import { headers, cookies } from 'next/headers';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import OrganizationSignUp from "@/components/onboarding/OrganizationSignUp";
import { redirect } from "next/navigation";

const setupUserOnboarding = async () => {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Unauthorized: No session found');
  }
  const accessToken = session.access_token;
  const res = await fetch(`${API_SERVER_URL}/onboarding`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to setup user onboarding');
  }

  const data = await res.json();

  if (data.onboardingOrganization.has_completed_onboarding) {
    // Redirect to dashboard if user has already completed onboarding
    return redirect('/');
  }
  
  return data;
}

export default async function Onboarding() {
  const { user, onboardingOrganization } = await setupUserOnboarding();

  return (
    <div className="flex flex-1 sm:h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <OrganizationSignUp user={user} organization={onboardingOrganization} />
    </div>
  )
}