// src/components/FeedPanel.jsx
import React, { useState, useEffect } from 'react';
import twitterService from '../services/twitter.js';

export default function FeedPanel({ onFeedSelect, onFeedsLoaded }) {
  const [feeds, setFeeds] = useState([]);
  const [selectedFeeds, setSelectedFeeds] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });

  useEffect(() => {
    loadFeeds();
  }, [dateRange]);

  const loadFeeds = async () => {
    try {
      // Temporary mock data until Twitter API integration
      const mockTweets = [
        { id: '1', text: 'Just finished a great coding session! #programming', created_at: '2024-02-25T10:00:00Z' },
        { id: '2', text: 'Learning new frameworks is always exciting. #webdev', created_at: '2024-02-25T11:00:00Z' },
        { id: '3', text: 'Coffee break with some algorithm practice. #coding', created_at: '2024-02-25T12:00:00Z' },
      ];
      setFeeds(mockTweets);
      onFeedsLoaded(mockTweets);
      // In production: const tweets = await twitterService.getUserTweets(dateRange);
      // setFeeds(tweets.data || []);
      // onFeedsLoaded(tweets.data || []);
    } catch (error) {
      console.error('Failed to load feeds:', error);
    }
  };

  const handleFeedSelect = (feedId) => {
    const newSelection = selectedFeeds.includes(feedId)
      ? selectedFeeds.filter(id => id !== feedId)
      : [...selectedFeeds, feedId];
    setSelectedFeeds(newSelection);
    onFeedSelect(newSelection);
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Select Feeds</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="date"
            className="border rounded p-2"
            value={dateRange.startDate.split('T')[0]}
            onChange={(e) => setDateRange({
              ...dateRange,
              startDate: new Date(e.target.value).toISOString()
            })}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={dateRange.endDate.split('T')[0]}
            onChange={(e) => setDateRange({
              ...dateRange,
              endDate: new Date(e.target.value).toISOString()
            })}
          />
        </div>
      </div>
      <div className="space-y-2">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className={`p-3 border rounded cursor-pointer ${
              selectedFeeds.includes(feed.id) ? 'bg-blue-50 border-blue-500' : ''
            }`}
            onClick={() => handleFeedSelect(feed.id)}
          >
            <p className="text-sm">{feed.text}</p>
            <span className="text-xs text-gray-500">
              {new Date(feed.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}