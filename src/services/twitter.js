// src/services/twitter.js
class TwitterService {
  constructor() {
    this.baseUrl = 'https://api.twitter.com/2';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setAccessToken(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  async getUserProfile() {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers,
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async getUserTweets(dateRange) {
    try {
      const { startDate, endDate } = dateRange;
      const response = await fetch(
        `${this.baseUrl}/tweets/search/recent?query=from:me&start_time=${startDate}&end_time=${endDate}`,
        { headers: this.headers }
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw error;
    }
  }
}

export default new TwitterService();