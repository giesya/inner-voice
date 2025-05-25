import { getUserPreferences, saveUserPreferences } from '../utils/dbUtils.js';

export default {
  async render() {
    const preferences = await getUserPreferences() || {
      notifications: {
        enabled: true,
        newStories: true,
        comments: true,
        mentions: true
      }
    };

    return `
      <div class="settings-container">
        <h2><i class="fas fa-cog"></i> Pengaturan</h2>
        
        <div class="settings-section">
          <h3>Notifikasi</h3>
          <div class="settings-group">
            <label class="toggle-switch">
              <input type="checkbox" id="notificationsEnabled" 
                ${preferences.notifications.enabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <span class="toggle-label">Aktifkan Notifikasi</span>
            </label>
          </div>

          <div class="settings-group" id="notificationOptions" 
            style="display: ${preferences.notifications.enabled ? 'block' : 'none'}">
            <label class="toggle-switch">
              <input type="checkbox" id="newStoriesEnabled" 
                ${preferences.notifications.newStories ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <span class="toggle-label">Cerita Baru</span>
            </label>

            <label class="toggle-switch">
              <input type="checkbox" id="commentsEnabled" 
                ${preferences.notifications.comments ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <span class="toggle-label">Komentar</span>
            </label>

            <label class="toggle-switch">
              <input type="checkbox" id="mentionsEnabled" 
                ${preferences.notifications.mentions ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <span class="toggle-label">Mentions</span>
            </label>
          </div>
        </div>

        <div class="settings-actions">
          <button id="saveSettings" class="btn btn-primary">
            <i class="fas fa-save"></i> Simpan Pengaturan
          </button>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const notificationsEnabled = document.getElementById('notificationsEnabled');
    const notificationOptions = document.getElementById('notificationOptions');
    const saveButton = document.getElementById('saveSettings');

    // Toggle notification options visibility
    notificationsEnabled.addEventListener('change', () => {
      notificationOptions.style.display = notificationsEnabled.checked ? 'block' : 'none';
    });

    // Save settings
    saveButton.addEventListener('click', async () => {
      try {
        const preferences = {
          notifications: {
            enabled: notificationsEnabled.checked,
            newStories: document.getElementById('newStoriesEnabled').checked,
            comments: document.getElementById('commentsEnabled').checked,
            mentions: document.getElementById('mentionsEnabled').checked
          }
        };

        await saveUserPreferences(preferences);

        // Request notification permission if enabled
        if (preferences.notifications.enabled && 'Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            alert('Izin notifikasi diperlukan untuk mengaktifkan fitur ini.');
            notificationsEnabled.checked = false;
            notificationOptions.style.display = 'none';
          }
        }

        alert('Pengaturan berhasil disimpan!');
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('Gagal menyimpan pengaturan. Silakan coba lagi.');
      }
    });
  }
}; 