// src/components/LibraryPanel.jsx
import React, { useState, useEffect } from 'react';

export default function LibraryPanel() {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStories();
    // Listen for storage changes from other components
    const handleStorageChange = () => loadStories();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadStories = () => {
    try {
      const savedStories = JSON.parse(localStorage.getItem('stories') || '[]');
      setStories(savedStories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const deleteStory = (id) => {
    try {
      const updatedStories = stories.filter(story => story.id !== id);
      localStorage.setItem('stories', JSON.stringify(updatedStories));
      setStories(updatedStories);
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Story Library</h2>
        <input
          type="text"
          placeholder="Search stories..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filteredStories.map((story) => (
          <div key={story.id} className="p-4 border rounded hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{story.title}</h3>
              <span className="text-xs text-gray-500">{story.template}</span>
            </div>
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
              {story.content}
            </p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                {new Date(story.createdAt).toLocaleString()}
              </p>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => deleteStory(story.id)}
                >
                  Delete
                </button>
                <button 
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  onClick={() => {
                    const blob = new Blob([story.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${story.title}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}