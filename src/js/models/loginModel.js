export class LoginModel {
  constructor(apiBase = 'https://story-api.dicoding.dev/v1') {
    this.apiBase = apiBase;
  }

  async login(email, password) {
    const res = await fetch(`${this.apiBase}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  }

  async register(name, email, password) {
    const res = await fetch(`${this.apiBase}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    return data;
  }
} 