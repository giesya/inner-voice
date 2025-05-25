import { HomeModel } from '../models/homeModel.js';
import { HomePresenter } from '../presenters/homePresenter.js';
import { initStoryListMap } from '../utils/mapUtils.js';
import { formatDate } from '../utils/helpers.js';

export class HomeView {
  constructor() {
    this.model = new HomeModel();
    this.presenter = new HomePresenter(this.model, this);
  }

  showLoading() {
    const mainContent = document.getElementById('maincontent');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat cerita...</p>
        </div>
      `;
    }
  }

  showError(message) {
    alert(message);
  }

  showSuccess(message) {
    alert(message);
  }

  redirectToHome() {
    location.hash = '#/';
  }

  renderStories(stories) {
    const mainContent = document.getElementById('maincontent');
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="stories-container home-content">
        <div class="stories-header">
          <h2>Daftar Cerita</h2>
          <div class="user-actions">
            ${localStorage.getItem('token') 
              ? `<button id="addBtn" class="btn-primary">
                  <i class="fas fa-plus"></i> Tambah Cerita
                </button>
                <button id="logoutBtn" class="btn-secondary">
                  <i class="fas fa-sign-out-alt"></i> Logout
                </button>`
              : `<button onclick="location.hash='#/login'" class="btn-primary">
                  <i class="fas fa-sign-in-alt"></i> Login
                </button>`
            }
          </div>
        </div>
        <div class="story-list">
          ${stories.length === 0 
            ? '<p class="no-stories">Belum ada cerita yang ditambahkan.</p>'
            : stories.map(story => `
                <div class="story-card" onclick="location.hash='#/story/${story.id}'">
                  <div class="story-image">
                    <img src="${story.photoUrl}" alt="${story.name}" loading="lazy">
                  </div>
                  <div class="story-content">
                    <h3>${story.name}</h3>
                    <p>${story.description}</p>
                    <div class="story-meta">
                      <span><i class="fas fa-calendar"></i> ${formatDate(story.createdAt)}</span>
                    </div>
                  </div>
                </div>
              `).join('')
          }
        </div>
        <div id="storyMap" class="story-map"></div>
      </div>
    `;

    // Initialize map after stories are rendered
    if (stories.length > 0) {
      initStoryListMap('storyMap', stories);
    }

    // Event listener untuk tombol tambah dan logout
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        location.hash = '#/add';
      });
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (this.presenter && typeof this.presenter.logout === 'function') {
          this.presenter.logout();
        }
      });
    }
  }

  showHomeView() {
    this.showLoading();
    this.presenter.loadStories();
  }
}