import { HomeModel } from '../models/homeModel.js';

export class HomePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    console.log('HomePresenter diinisialisasi dengan view:', view);
  }

  async loadStories() {
    try {
      this.view.showLoading();
      const token = localStorage.getItem('token');
      console.log('Mengambil cerita dengan token:', token);
      const response = await this.model.getStories(token);
      console.log('API response:', response);
      if (!response.error && response.listStory) {
        if (response.listStory.length === 0) {
          this.view.showError('Belum ada cerita yang ditambahkan.');
        } else {
          this.view.renderStories(response.listStory);
        }
      } else {
        this.view.showError('Gagal memuat cerita: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saat memuat cerita:', error);
      this.view.showError('Terjadi kesalahan saat memuat cerita: ' + error.message);
    }
  }

  logout() {
    try {
      localStorage.removeItem('token');
      if (this.view && typeof this.view.showSuccess === 'function') {
        this.view.showSuccess('Logout berhasil!');
        location.hash = '#/login';
      } else {
        console.error('View atau showSuccess method tidak tersedia');
        alert('Logout berhasil!');
        location.hash = '#/login';
      }
    } catch (error) {
      console.error('Error saat logout:', error);
      if (this.view && typeof this.view.showError === 'function') {
        this.view.showError('Terjadi kesalahan saat logout. Silakan coba lagi.');
      } else {
        console.error('View atau showError method tidak tersedia');
        alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
      }
    }
  }
} 