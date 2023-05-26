import DashboardLayout from '@/components/DashboardLayout';
import UserProvider from '@/contexts/userContext';
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/users';

export default async function Dashboard() {
  const {user} = await fetchUser();
  if (user && (user.organizations.length === 0 || !user.organizations[0].has_completed_onboarding)) {
    redirect('/onboarding');
  }

  return (
    <UserProvider user={user}>
      <DashboardLayout />
    </UserProvider>
  )
}
