// src/components/StoryPanel.jsx
import React, { useState } from 'react';
import aiService from '../services/ai.js';

export default function StoryPanel({ selectedFeeds, feeds }) {
  const [story, setStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [template, setTemplate] = useState('narrative');
  const [error, setError] = useState('');
  
  const selectedTweets = feeds.filter(feed => selectedFeeds.includes(feed.id));

  const generateStory = async () => {
    if (selectedFeeds.length === 0) {
      setError('Please select at least one tweet to generate a story.');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    try {
      const selectedTweets = feeds.filter(feed => selectedFeeds.includes(feed.id));
      const result = await aiService.generateStory(selectedTweets, template);
      const timestamp = new Date().toISOString();
      const newStory = {
        id: `story_${timestamp}`,
        title: `${template.charAt(0).toUpperCase() + template.slice(1)} Story - ${new Date().toLocaleDateString()}`,
        content: result.story,
        template,
        createdAt: timestamp
      };
      // Store in localStorage
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');
      localStorage.setItem('stories', JSON.stringify([newStory, ...stories]));
      setStory(newStory.content);
      // Dispatch storage event for immediate library update
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Failed to generate story:', error);
      setError(error.message || 'Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async (newContent) => {
    try {
      const result = await aiService.editStory(story, newContent);
      setStory(result.story);
    } catch (error) {
      console.error('Failed to edit story:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Story Generator</h2>
        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <h3 className="text-sm font-semibold mb-2">Selected Tweets ({selectedTweets.length})</h3>
          {selectedTweets.map(tweet => (
            <div key={tweet.id} className="text-sm text-gray-600 mb-2 last:mb-0">
              {tweet.text}
            </div>
          ))}
          {selectedTweets.length === 0 && (
            <p className="text-sm text-gray-500 italic">Select tweets from the feed panel to generate a story</p>
          )}
        </div>
        <select
          className="w-full p-2 border rounded mb-4"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="narrative">Narrative</option>
          <option value="blog">Blog Post</option>
          <option value="script">Podcast Script</option>
        </select>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}
        <button
          className={`w-full p-2 rounded text-white ${
            isGenerating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={generateStory}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Story'}
        </button>
      </div>
      {(story || isGenerating) && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated Story</h3>
          <div className="relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="text-blue-500">Generating your story...</div>
              </div>
            )}
            <textarea
              className="w-full h-64 p-4 border rounded font-serif text-gray-700 leading-relaxed"
              value={story}
              onChange={(e) => handleEdit(e.target.value)}
              placeholder="Your story will appear here..."
              disabled={isGenerating}
            />
          </div>
        </div>
      )}
    </div>
  );
}