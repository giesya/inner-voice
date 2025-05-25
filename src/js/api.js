const API_BASE = 'https://story-api.dicoding.dev/v1';

// register user baru
async function registerUser(email, password, name='User') {
  try {
    console.log('Mendaftarkan user:', email);
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await res.json();
  } catch (error) {
    console.error('Terjadi error saat registrasi:', error);
    return { error: true, message: 'Registrasi gagal. Silakan cek koneksi internet Anda dan coba lagi.' };
  }
}

// login user
async function loginUser(email, password) {
  try {
    console.log('Login user:', email);
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (error) {
    console.error('Terjadi error saat login:', error);
    return { error: true, message: 'Login gagal. Silakan cek koneksi internet Anda dan coba lagi.' };
  }
}

// mengambil list cerita
async function fetchStories(token = null) {
  try {
    console.log('Mengambil daftar cerita, token ada:', !!token);
    const res = await fetch(`${API_BASE}/stories?page=1&size=20&location=1`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    return await res.json();
  } catch (error) {
    console.error('Terjadi error saat mengambil cerita:', error);
    return { error: true, message: 'Gagal memuat cerita. Silakan cek koneksi internet Anda dan coba lagi.' };
  }
}

// mengambil detail cerita
async function fetchStoryDetail(id, token = null) {
  try {
    console.log('Mengambil detail cerita:', id);
    const res = await fetch(`${API_BASE}/stories/${id}`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    return await res.json();
  } catch (error) {
    console.error('Terjadi error saat mengambil detail cerita:', error);
    return { error: true, message: 'Gagal memuat detail cerita. Silakan cek koneksi internet Anda dan coba lagi.' };
  }
}

// menambah cerita baru
async function addStory(formData, token = null) {
  try {
    console.log('Menambah cerita baru, token ada:', !!token);
    const res = await fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error('Terjadi error saat menambah cerita:', error);
    return { error: true, message: 'Gagal menambah cerita. Silakan cek koneksi internet Anda dan coba lagi.' };
  }
}

export {
  registerUser,
  loginUser,
  fetchStories,
  fetchStoryDetail,
  addStory
};