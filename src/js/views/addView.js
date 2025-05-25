import { AddModel } from '../models/addModel.js';
import { AddPresenter } from '../presenters/addPresenter.js';
import { initAddStoryMap } from '../utils/mapUtils.js';
import { setupImagePreview, pageTransition } from '../utils/helpers.js';

export class AddView {
  constructor() {
    this.model = new AddModel();
    this.presenter = new AddPresenter(this.model, this);
    this.mapInstance = null;
    this.cameraStream = null;
  }

  showLoading() {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    }
  }

  hideLoading() {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim';
    }
  }

  showError(message) {
    alert(message);
  }

  showSuccess(message) {
    alert(message);
  }

  redirectToLogin() {
    location.hash = '#/login';
  }

  redirectToHome() {
    location.hash = '#/';
  }

  async setupCamera(previewId) {
    const video = document.getElementById('camera');
    const captureBtn = document.getElementById('capture');
    const preview = document.getElementById(previewId);
    
    if (!video || !captureBtn || !preview) return;

    // Show video and capture button
    video.style.display = 'block';
    captureBtn.style.display = 'inline-block';
    preview.style.display = 'none';

    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.cameraStream;
      video.play();
    } catch (err) {
      alert('Tidak dapat mengakses kamera: ' + err.message);
      video.style.display = 'none';
      captureBtn.style.display = 'none';
      return;
    }

    // Helper: Convert dataURL to File
    function dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], filename, {type:mime});
    }

    // Capture photo
    captureBtn.onclick = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      preview.src = dataUrl;
      preview.style.display = 'block';
      video.style.display = 'none';
      captureBtn.style.display = 'none';
      // Stop camera
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop());
      }
      // Set file input to captured image
      const fileInput = document.getElementById('photo');
      if (fileInput) {
        const file = dataURLtoFile(dataUrl, 'camera-capture.png');
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
      }
    };

    // Return cleanup function
    return () => {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop());
      }
      video.style.display = 'none';
      captureBtn.style.display = 'none';
    };
  }

  render() {
    console.log('Rendering add story view');

    const mainContent = document.getElementById('maincontent');
    if (!mainContent) {
      console.error('Main content element not found');
      return;
    }

    mainContent.innerHTML = '';
    pageTransition();

    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    formContainer.innerHTML = `
      <h2 id="add-story-title">Tambah Cerita Baru</h2>
      <form id="formAdd" novalidate aria-labelledby="add-story-title" role="form">
        <div class="form-group">
          <label for="desc">Deskripsi Cerita</label>
          <textarea id="desc" required placeholder="Ceritakan pengalamanmu..." aria-required="true" aria-label="Deskripsi Cerita"></textarea>
        </div>

        <div class="form-group">
          <label for="photo">Foto Cerita (maks 1MB)</label>
          <div class="photo-input-container">
            <input type="file" id="photo" accept="image/*" required aria-required="true" aria-label="Foto Cerita" />
            <button type="button" id="toggleCamera" aria-pressed="false" aria-label="Gunakan Kamera">Gunakan Kamera</button>
          </div>
          <div class="camera-container">
            <video id="camera" style="display: none;" width="320" height="240" aria-label="Pratinjau Kamera" tabindex="0"></video>
            <button type="button" id="capture" style="display: none;" aria-label="Ambil Foto">Ambil Foto</button>
          </div>
          <img id="preview" alt="Preview foto cerita" style="display: none; max-width: 100%; margin-top: 1rem; border-radius: 8px;" />
        </div>

        <div class="form-group">
          <label>Pilih Lokasi (opsional)</label>
          <p class="hint">Klik pada peta untuk menandai lokasi cerita</p>
          <div id="map" tabindex="0" aria-label="Peta Pilih Lokasi"></div>
          <p>Lokasi terpilih: <span id="locDisplay">Tidak ada</span></p>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" aria-label="Kirim Cerita">
            <i class="fas fa-paper-plane"></i> Kirim
          </button>
          <button type="button" class="btn-secondary" onclick="location.hash='#/'" aria-label="Batal Tambah Cerita">
            <i class="fas fa-times"></i> Batal
          </button>
        </div>
      </form>
    `;

    mainContent.appendChild(formContainer);
    setupImagePreview('photo', 'preview');

    setTimeout(() => {
      console.log('Initializing map for add view');
      this.mapInstance = initAddStoryMap('map', 'locDisplay');
    }, 100);

    let cleanupCameraFn = null;
    const toggleCameraBtn = document.getElementById('toggleCamera');
    if (toggleCameraBtn) {
      toggleCameraBtn.addEventListener('click', () => {
        const cameraContainer = document.querySelector('.camera-container');
        if (cameraContainer) {
          if (cameraContainer.style.display !== 'block') {
            cameraContainer.style.display = 'block';
            cleanupCameraFn = this.setupCamera('preview');
          } else {
            cameraContainer.style.display = 'none';
            if (cleanupCameraFn) cleanupCameraFn();
          }
        }
      });
    }

    const formAdd = document.getElementById('formAdd');
    if (formAdd) {
      formAdd.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleFormSubmit();
      });
    }
  }

  async handleFormSubmit() {
    console.log('Handling form submission');

    const descInput = document.getElementById('desc');
    const fileInput = document.getElementById('photo');

    if (!descInput || !fileInput) {
      console.error('Form elements not found');
      return;
    }

    const desc = descInput.value.trim();
    const file = fileInput.files[0];

    if (!desc) {
      this.showError('Deskripsi cerita harus diisi');
      descInput.focus();
      return;
    }

    if (!file) {
      this.showError('Foto cerita harus dipilih');
      return;
    }

    if (file.size > 1024 * 1024) {
      this.showError('Ukuran foto maksimal 1MB');
      return;
    }

    const formData = new FormData();
    formData.append('description', desc);
    formData.append('photo', file);

    if (this.mapInstance && typeof this.mapInstance.getSelectedLocation === 'function') {
      const location = this.mapInstance.getSelectedLocation();
      if (location && location.lat !== undefined && location.lon !== undefined) {
        formData.append('lat', location.lat);
        formData.append('lon', location.lon);
      }
    }

    await this.presenter.handleFormSubmit(formData);
  }

  // Method to stop camera when view is destroyed
  destroy() {
    // Stop camera stream if active
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    
    // Clean up map instance
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
  }
}
