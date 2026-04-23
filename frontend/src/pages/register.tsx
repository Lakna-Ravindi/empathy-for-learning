import { Header } from '@/components/layout/Header';

export default function RegisterPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>
          <div className="text-gray-500">
            <p className="mb-4">Registration functionality coming in Phase 2.</p>
            <p className="text-sm">
              This page will include user registration with email verification and profile setup.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
