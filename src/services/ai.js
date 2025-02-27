// src/services/ai.js
class AIService {
  constructor() {
    this.baseUrl = '/api/ai'; // This would connect to your backend AI service
  }

  async generateStory(tweets, template) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Mock story generation based on template and tweets
      const storyIntro = {
        narrative: 'A day in the life of a developer...',
        blog: 'Tech Journey: Daily Developer Updates',
        script: '[Scene: A developer's workspace]'
      }[template];
      
      const storyContent = tweets
        .map(tweet => tweet.text.replace(/#\w+/g, '').trim())
        .join('\n\n');
      
      const storyOutro = {
        narrative: '...and that's how the day unfolded.',
        blog: 'Stay tuned for more updates!',
        script: '[End Scene]'
      }[template];

      return {
        story: `${storyIntro}\n\n${storyContent}\n\n${storyOutro}`
      };
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story. Please try again.');
    }
  }

  async editStory(story, changes) {
    try {
      const response = await fetch(`${this.baseUrl}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story,
          changes,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error editing story:', error);
      throw error;
    }
  }
}

export default new AIService();