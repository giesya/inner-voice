export default {
  render: () => {
    return `
      <div class="not-found-container">
        <div class="not-found-content">
          <i class="fas fa-map-signs not-found-icon"></i>
          <h1>404</h1>
          <h2>Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
          <a href="/" class="btn btn-primary">
            <i class="fas fa-home"></i> Kembali ke Beranda
          </a>
        </div>
      </div>
    `;
  }
}; 