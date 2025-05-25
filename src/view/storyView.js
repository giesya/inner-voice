export class StoryView {
  constructor() {
    this.storyList = document.querySelector('#storyList');
    this.form = document.querySelector('#storyForm');
  }

  showLoading() {
    this.storyList.innerHTML = '<div class="loading">Loading stories...</div>';
  }

  showError(message) {
    this.storyList.innerHTML = `<div class="error">${message}</div>`;
  }

  renderStories(stories) {
    this.storyList.innerHTML = '';
    
    stories.forEach((story) => {
      const card = document.createElement('div');
      card.classList.add('story-card');
      card.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
      `;
      this.storyList.appendChild(card);
    });
  }

  bindAddStory(handler) {
    if (this.form) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(this.form);
        const storyData = {
          name: formData.get('name'),
          description: formData.get('description'),
          photoUrl: formData.get('photoUrl')
        };
        handler(storyData);
      });
    }
  }
}
