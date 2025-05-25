import { HomeView } from './views/homeView.js';
import { HomePresenter } from './presenters/homePresenter.js';
import { AddView } from './views/addView.js';
import { AddPresenter } from './presenters/addPresenter.js';
import { DetailView } from './views/detailView.js';
import { DetailPresenter } from './presenters/detailPresenter.js';
import { LoginView } from './views/loginView.js';
import { LoginPresenter } from './presenters/loginPresenter.js';
import NotFoundView from './views/notFoundView.js';
import { subscribeToPushNotifications, getCurrentPushSubscription, getNotificationPermission } from './utils/pushNotificationUtils.js';
import { initDB, getUserPreferences } from './utils/dbUtils.js';

// Inisialisasi views terlebih dahulu
const homeView = new HomeView();
const addView = new AddView();
const detailView = new DetailView();
const loginView = new LoginView();
const notFoundView = NotFoundView;

// Kemudian inisialisasi presenter dengan model dan view masing-masing
const homePresenter = new HomePresenter(homeView.model, homeView);
const addPresenter = new AddPresenter(addView.model, addView);
const detailPresenter = new DetailPresenter(detailView.model, detailView);
const loginPresenter = new LoginPresenter(loginView.model, loginView);

// Set presenter ke view
homeView.presenter = homePresenter;
addView.presenter = addPresenter;
detailView.presenter = detailPresenter;
loginView.presenter = loginPresenter;

let currentView = null;

// Fungsi global untuk menonaktifkan semua kamera di halaman
function stopAllCameraStreams() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  });
}

// Alias global Camera agar sesuai permintaan user
window.Camera = {
  stopAllStreams: stopAllCameraStreams
};

// Event listener hashchange dengan Camera.stopAllStreams
window.addEventListener('hashchange', async () => {
  // Matikan semua kamera sebelum render halaman baru
  window.Camera.stopAllStreams();
  // Jalankan router (render halaman)
  router();
});

function router() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1);
  
  // Bersihkan current view jika ada
  if (currentView && typeof currentView.destroy === 'function') {
    console.log('Cleaning up current view:', currentView.constructor.name);
    currentView.destroy();
  }
  
  // Tampilkan loading state
  const mainContent = document.getElementById('maincontent');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat halaman...</p>
      </div>
    `;
  }
  
  // Penanganan routing
  if (path === '/') {
    currentView = homeView;
    currentView.showHomeView();
  } else if (path === '/add') {
    currentView = addView;
    currentView.render();
  } else if (path === '/login') {
    currentView = loginView;
    if (typeof currentView.showLoginView === 'function') {
      currentView.showLoginView();
    } else {
      currentView.render();
    }
  } else if (path.startsWith('/story/')) {
    const storyId = path.split('/')[2];
    currentView = detailView;
    if (typeof currentView.showDetailView === 'function') {
      currentView.showDetailView(storyId);
    } else {
      currentView.render(storyId);
    }
  } else {
    // Handle 404 dengan Not Found View
    mainContent.innerHTML = notFoundView.render();
  }
}

// Inisialisasi aplikasi
async function initApp() {
  console.log('Initializing app...');
  
  try {
    // Initialize database first
    await initDB();
    console.log('Database initialized successfully');

    // Initialize user preferences
    await getUserPreferences();
    console.log('User preferences initialized');

    // Check notification permission status
    const notificationPermission = getNotificationPermission();
    if (notificationPermission === 'default') {
      // Add notification permission button to navbar
      const navbar = document.querySelector('nav');
      if (navbar) {
        const notificationBtn = document.createElement('button');
        notificationBtn.className = 'notification-btn';
        notificationBtn.innerHTML = '<i class="fas fa-bell"></i> Aktifkan Notifikasi';
        notificationBtn.onclick = async () => {
          try {
            await subscribeToPushNotifications();
            notificationBtn.remove();
          } catch (error) {
            console.error('Error subscribing to push notifications:', error);
          }
        };
        navbar.appendChild(notificationBtn);
      }
    } else if (notificationPermission === 'granted') {
      // Check if we need to subscribe
      const subscription = await getCurrentPushSubscription();
      if (!subscription) {
        await subscribeToPushNotifications();
      }
    }
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
  
  // Tambahkan transisi halaman yang mulus
  const style = document.createElement('style');
  style.textContent = `
    .page-transition {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    .page-transition.active {
      opacity: 1;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Tambahkan class transisi ke main content
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('page-transition');
    // Trigger reflow
    mainContent.offsetHeight;
    mainContent.classList.add('active');
  }

  // Dengarkan perubahan hash dan visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentView && typeof currentView.destroy === 'function') {
      console.log('Page hidden, cleaning up current view:', currentView.constructor.name);
      currentView.destroy();
    }
  });
  
  // Jalankan route awal
  console.log('Running initial route...');
  router();
}

export { initApp };