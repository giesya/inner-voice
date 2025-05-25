import { showHomeView } from './views/homeView.js';
import { showDetailView } from './views/detailView.js';
import { showAddView } from './views/addView.js';
import { showLoginView } from './views/loginView.js';
import { showError } from './utils/helpers.js';

// untuk navigasi
function router() {
  const hash = location.hash || '#/';
  const route = hash.substring(1);
  
  // untuk debugging
  console.log('Route changed to:', route);
  
  // Tentukan view yang akan ditampilkan
  if (route === '/' || route === '') {
    showHomeView();
  } else if (route === '/add') {
    // Redirect ke login jika belum login
    if (!localStorage.getItem('token')) {
      alert('Anda harus login untuk menambah cerita');
      location.hash = '#/login';
      return;
    }
    showAddView();
  } else if (route === '/login') {
    console.log('Loading login view');
    showLoginView();
  } else if (route.startsWith('/story/')) {
    const id = route.split('/')[2];
    if (id) {
      showDetailView(id);
    } else {
      showError('ID cerita tidak valid');
    }
  } else {
    showError('Halaman tidak ditemukan');
  }
}

export {
  router
};

// Alias global agar sesuai permintaan user
window.app = window.app || {};
window.app.renderPage = router;

window.addEventListener('hashchange', async () => {
  await window.app.renderPage();
  // Matikan semua media aktif
  window.Camera.stopAllStreams();
});