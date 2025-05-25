export class DetailPresenter {
  constructor(model, view) {
    if (!view) {
      throw new Error('View diperlukan untuk DetailPresenter');
    }
    this.model = model;
    this.view = view;
    console.log('DetailPresenter diinisialisasi dengan view:', view);
  }

  async loadStoryDetail(id) {
    try {
      console.log('Memuat detail cerita untuk ID:', id);
      const token = localStorage.getItem('token');
      const response = await this.model.getStoryDetail(id, token);
      
      if (!response.error) {
        if (this.view && typeof this.view.renderStoryDetail === 'function') {
          this.view.renderStoryDetail(response.story);
        } else {
          console.error('View atau metode renderStoryDetail tidak tersedia');
          alert('Gagal menampilkan detail cerita');
        }
      } else {
        if (this.view && typeof this.view.showError === 'function') {
          this.view.showError('Gagal memuat detail cerita: ' + response.message);
        } else {
          console.error('View atau metode showError tidak tersedia');
          alert('Gagal memuat detail cerita: ' + response.message);
        }
      }
    } catch (error) {
      console.error('Error dalam loadStoryDetail:', error);
      if (this.view && typeof this.view.showError === 'function') {
        this.view.showError('Terjadi kesalahan saat memuat detail cerita');
      } else {
        console.error('View atau metode showError tidak tersedia');
        alert('Terjadi kesalahan saat memuat detail cerita');
      }
    }
  }
} 