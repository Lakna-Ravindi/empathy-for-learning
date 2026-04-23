import { Header } from '@/components/layout/Header';
import { withAuth } from '@/lib/withAuth';

function ProfilePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
          <div className="text-gray-500">
            <p className="mb-4">Profile page coming in Phase 2.</p>
            <p className="text-sm">
              This page will show your personal information, emotional history, and SEEK skill
              progress.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(ProfilePage);
