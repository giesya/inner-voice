export default {
  render() {
    return `
      <div class="offline-container">
        <div class="offline-content">
          <i class="fas fa-wifi-slash offline-icon"></i>
          <h2>Anda Sedang Offline</h2>
          <p>Beberapa fitur mungkin tidak tersedia saat ini.</p>
          <p>Konten yang sudah di-cache masih dapat diakses.</p>
          <button id="retryConnection" class="btn btn-primary">
            <i class="fas fa-sync-alt"></i> Coba Lagi
          </button>
        </div>
      </div>
    `;
  },

  afterRender() {
    const retryButton = document.getElementById('retryConnection');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        if (navigator.onLine) {
          window.location.reload();
        } else {
          alert('Masih offline. Silakan periksa koneksi internet Anda.');
        }
      });
    }
  }
}; 