import { StoryModel } from '../model/storyModel.js';

export class StoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
    
    // Bind event handlers
    this.view.bindAddStory(this.handleAddStory.bind(this));
    
    // Initial load
    this.loadStories();
  }

  async loadStories() {
    try {
      this.view.showLoading();
      const stories = await this.model.getStories();
      this.view.renderStories(stories);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async handleAddStory(storyData) {
    try {
      this.view.showLoading();
      await this.model.addStory(storyData);
      await this.loadStories(); // Reload stories after adding new one
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
