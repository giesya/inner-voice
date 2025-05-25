export class AddModel {
  constructor(apiBase = 'https://story-api.dicoding.dev/v1') {
    this.apiBase = apiBase;
  }

  async addStory(formData, token) {
    try {
      const response = await fetch(`${this.apiBase}/stories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error menambahkan cerita:', error);
      return {
        error: true,
        message: error.message
      };
    }
  }
} 