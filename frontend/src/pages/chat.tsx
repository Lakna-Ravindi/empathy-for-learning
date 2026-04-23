import { Header } from '@/components/layout/Header';
import { withAuth } from '@/lib/withAuth';

function ChatPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat with Counselor</h1>
          <div className="text-gray-500">
            <p className="mb-4">Chat interface coming in Phase 2.</p>
            <p className="text-sm">
              This page will display the conversation interface with the AI counselor, including
              emotional analysis and SEEK-based suggestions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(ChatPage);
