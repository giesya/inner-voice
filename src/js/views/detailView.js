import { DetailModel } from '../models/detailModel.js';
import { initStoryDetailMap } from '../utils/mapUtils.js';
import { formatDate } from '../utils/helpers.js';

export class DetailView {
  constructor() {
    this.model = new DetailModel();
    this.presenter = null;
  }

  showLoading() {
    const mainContent = document.getElementById('maincontent');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat detail cerita...</p>
        </div>
      `;
    }
  }

  showError(message) {
    alert(message);
  }

  renderStoryDetail(story) {
    const mainContent = document.getElementById('maincontent');
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="story-detail-container">
        <button class="back-button" onclick="location.hash='#/'">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>

        <div class="story-detail-content">
          <div class="story-detail-header">
            <h2>${story.name}</h2>
            <div class="story-meta">
              <span><i class="fas fa-user"></i> ${story.name}</span>
              <span><i class="fas fa-calendar-alt"></i> ${formatDate(story.createdAt)}</span>
            </div>
          </div>

          <div class="story-detail-body">
            <div class="story-image-container">
              <img src="${story.photoUrl}" alt="Foto cerita ${story.name}" class="detail-image" loading="lazy">
            </div>
            
            <div class="story-description">
              <p>${story.description}</p>
            </div>
          </div>

          <div class="story-location-section">
            <h3><i class="fas fa-map-marker-alt"></i> Lokasi Cerita</h3>
            <div id="map" class="story-map"></div>
          </div>
        </div>
      </div>
    `;

    // Initialize map after story detail is rendered
    if (story.lat && story.lon) {
      initStoryDetailMap('map', story);
    }
  }

  showDetailView(id) {
    this.showLoading();
    this.presenter.loadStoryDetail(id);
  }
}