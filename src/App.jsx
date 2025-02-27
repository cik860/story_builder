// src/App.jsx
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import FeedPanel from './components/FeedPanel.jsx';
import StoryPanel from './components/StoryPanel.jsx';
import LibraryPanel from './components/LibraryPanel.jsx';

function MainApp() {
  const { user, loading, login, logout } = useAuth();
  const [selectedFeeds, setSelectedFeeds] = React.useState([]);
  const [feeds, setFeeds] = React.useState([]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Social Feed Story Generator</h1>
        <button
          onClick={login}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Login with Twitter
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Social Feed Story Generator</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <FeedPanel
              onFeedSelect={(feeds) => setSelectedFeeds(feeds)}
              onFeedsLoaded={(newFeeds) => setFeeds(newFeeds)}
            />
          </div>
          <div>
            <StoryPanel
              selectedFeeds={selectedFeeds}
              feeds={feeds}
            />
          </div>
        </div>
        <div className="mt-8">
          <LibraryPanel />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}