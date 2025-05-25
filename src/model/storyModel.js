export class StoryModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async getStories() {
    try {
      const response = await fetch(`${this.baseUrl}/stories`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const responseJson = await response.json();
      return responseJson.listStory; // Return the listStory array from the response
    } catch (error) {
      throw new Error(`Error fetching stories: ${error.message}`);
    }
  }

  async addStory(storyData) {
    try {
      const response = await fetch(`${this.baseUrl}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add story');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Error adding story: ${error.message}`);
    }
  }
}
