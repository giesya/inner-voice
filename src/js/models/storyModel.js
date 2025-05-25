export class StoryModel {
  constructor(apiBase = 'https://story-api.dicoding.dev/v1') {
    this.apiBase = apiBase;
  }

  async getStories(token) {
    const res = await fetch(`${this.apiBase}/stories?page=1&size=20&location=1`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    const data = await res.json();
    return data;
  }

  async getStoryDetail(id, token) {
    const res = await fetch(`${this.apiBase}/stories/${id}`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    const data = await res.json();
    return data;
  }

  async addStory(formData, token) {
    const res = await fetch(`${this.apiBase}/stories`, {
      method: 'POST',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      body: formData
    });
    const data = await res.json();
    return data;
  }
} 