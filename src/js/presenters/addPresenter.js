import { StoryModel } from '../models/storyModel.js';

export class AddPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async handleFormSubmit(formData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.view.showError('Anda harus login untuk menambah cerita');
        this.view.redirectToLogin();
        return;
      }

      this.view.showLoading();
      const response = await this.model.addStory(formData, token);
      console.log('API addStory response:', response);

      if (!response.error) {
        this.view.showSuccess('Cerita berhasil dikirim');
        this.view.redirectToHome();
      } else {
        this.view.showError('Gagal mengirim cerita: ' + (response.message || JSON.stringify(response)));
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      this.view.showError('Terjadi kesalahan saat mengirim cerita: ' + error.message);
    } finally {
      this.view.hideLoading();
    }
  }
} 