import { StoryView } from './view/storyView.js';
import { StoryPresenter } from './presenter/storyPresenter.js';

// Initialize MVP components
document.addEventListener('DOMContentLoaded', () => {
  // Initialize View and Presenter
  const view = new StoryView();
  const presenter = new StoryPresenter(view);

  // Add transition styles
  const style = document.createElement('style');
  style.textContent = `
    .page-transition {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    .page-transition.active {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // Add transition class to main content
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('page-transition');
    // Trigger reflow
    mainContent.offsetHeight;
    mainContent.classList.add('active');
  }
});
