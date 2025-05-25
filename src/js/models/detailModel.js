export class DetailModel {
  constructor(apiBase = 'https://story-api.dicoding.dev/v1') {
    this.apiBase = apiBase;
  }

  async getStoryDetail(id, token) {
    const res = await fetch(`${this.apiBase}/stories/${id}`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    const data = await res.json();
    return data;
  }
} 