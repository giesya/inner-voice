// helpers.js
/**
 * Utility functions for the application
 */

// Cache for transitions to prevent multiple simultaneous transitions
let transitionInProgress = false;
let currentContainer = null;

/**
 * Shows loading indicator in specified container
 * @param {string} containerId - ID of container element
 */
function showLoading(containerId = 'maincontent') {
  console.log('Showing loading indicator');
  const container = document.getElementById(containerId);
  if (container) {
    // Store reference to current container
    currentContainer = container;
    container.innerHTML = '<div class="loading">Memuat...</div>';
  } else {
    console.error(`Container with ID ${containerId} not found`);
  }
}

/**
 * Displays error message in specified container
 * @param {string} message - Error message to display
 * @param {string} containerId - ID of container element
 */
function showError(message, containerId = 'maincontent') {
  console.error('Error displayed to user:', message);
  const container = document.getElementById(containerId);
  if (container) {
    // Fade in error message
    container.innerHTML = `
      <div class="error-message" style="opacity: 0; transform: translateY(10px)">
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
        <button onclick="location.hash='#/'">Kembali</button>
      </div>
    `;
    
    // Animate error message
    const errorEl = container.querySelector('.error-message');
    if (errorEl) {
      errorEl.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
      );
    }
  } else {
    console.error(`Container with ID ${containerId} not found`);
  }
}

/**
 * Sets up image preview functionality
 * @param {string} fileInputId - ID of file input element
 * @param {string} previewImageId - ID of image preview element
 */
function setupImagePreview(fileInputId, previewImageId) {
  const fileInput = document.getElementById(fileInputId);
  const preview = document.getElementById(previewImageId);
  
  if (!fileInput || !preview) {
    console.error('Image preview elements not found:', fileInputId, previewImageId);
    return;
  }
  
  console.log('Setting up image preview for:', fileInputId);
  
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    
    if (file && file.size <= 1024 * 1024) { // Max 1MB
      const reader = new FileReader();
      
      reader.onload = () => {
        // Smoothly fade in the image
        preview.style.opacity = '0';
        preview.src = reader.result;
        preview.style.display = 'block';
        
        // Once the image is loaded, fade it in
        preview.onload = () => {
          preview.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 300, easing: 'ease-out', fill: 'forwards' }
          );
        };
      };
      
      reader.readAsDataURL(file);
    } else if (file) {
      alert('File harus kurang dari 1MB');
      fileInput.value = '';
      preview.style.display = 'none';
    }
  });
}

/**
 * Formats date string to Indonesian locale
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Improved page transition animation that prevents white flashes
 * @param {string} containerId - ID of container element to animate
 * @returns {Promise} Promise that resolves when animation completes
 */
function pageTransition(containerId = 'maincontent') {
  // Prevent multiple transitions from running simultaneously
  if (transitionInProgress) {
    console.log('Transition already in progress, skipping');
    return Promise.resolve();
  }
  
  console.log('Applying page transition effect');
  transitionInProgress = true;
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    transitionInProgress = false;
    return Promise.resolve();
  }

  // Check if View Transition API is supported
  if (document.startViewTransition) {
    return new Promise((resolve) => {
      document.startViewTransition(() => {
        // The callback is called when the transition is ready to start
        container.style.viewTransitionName = 'page';
        return new Promise((innerResolve) => {
          // Wait for the next frame to ensure the transition is applied
          requestAnimationFrame(() => {
            innerResolve();
            resolve();
          });
        });
      }).finished.then(() => {
        // Clean up after transition
        container.style.viewTransitionName = '';
        transitionInProgress = false;
      });
    });
  } else {
    // Fallback for browsers that don't support View Transition API
    document.documentElement.style.willChange = 'transform';
    container.style.willChange = 'transform';
    
    const animation = container.animate(
      [
        { opacity: 0.95, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: 300,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        fill: 'forwards'
      }
    );
    
    return new Promise((resolve) => {
      animation.onfinish = () => {
        document.documentElement.style.willChange = 'auto';
        container.style.willChange = 'auto';
        transitionInProgress = false;
        resolve();
      };
      
      animation.oncancel = () => {
        document.documentElement.style.willChange = 'auto';
        container.style.willChange = 'auto';
        transitionInProgress = false;
        resolve();
      };
    });
  }
}

/**
 * Preloads a page content before navigating
 * @param {string} url - URL to preload
 * @param {Function} renderFunction - Function to render content
 * @returns {Promise} Promise that resolves with preloaded content
 */
function preloadPage(url, renderFunction) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Create offline version of the content but don't insert into DOM yet
      const content = renderFunction(data);
      return content;
    });
}

/**
 * Smoothly transitions between pages with NO white flashes
 * @param {string} url - URL to navigate to
 * @param {Function} renderFunction - Function to render content
 * @param {string} containerId - ID of container element
 * @returns {Promise} Promise that resolves when transition completes
 */
async function smoothPageNavigation(url, renderFunction, containerId = 'maincontent') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }
  
  try {
    // Create a clone of the container to hold new content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '0';
    tempContainer.style.left = '0';
    tempContainer.style.width = '100%';
    tempContainer.style.height = '100%';
    tempContainer.style.opacity = '0';
    tempContainer.style.zIndex = '-1';
    tempContainer.style.pointerEvents = 'none';
    document.body.appendChild(tempContainer);
    
    // Start loading data while current page is still visible
    const newContentPromise = preloadPage(url, renderFunction);
    
    // Do not fade out current content until new content is ready
    const newContent = await newContentPromise;
    
    // Put new content in temporary container and preload any images
    tempContainer.innerHTML = newContent;
    
    // Preload any images in the new content
    const imagePromises = [];
    tempContainer.querySelectorAll('img').forEach(img => {
      if (!img.complete) {
        imagePromises.push(new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // Still continue even if image fails
        }));
      }
    });
    
    // Wait for images to load (if any)
    if (imagePromises.length > 0) {
      await Promise.all(imagePromises);
    }
    
    // Only now fade out the current content
    const fadeOutAnimation = container.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-20px)' }
      ],
      { 
        duration: 200, 
        easing: 'ease-in',
        fill: 'forwards'
      }
    );
    
    // Wait for fade out animation to complete
    await new Promise(resolve => {
      fadeOutAnimation.onfinish = resolve;
      fadeOutAnimation.oncancel = resolve;
    });
    
    // Swap the content (with new content already prepared)
    container.innerHTML = newContent;
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    // Remove the temporary container
    document.body.removeChild(tempContainer);
    
    // Immediately start fade in animation without any delay
    requestAnimationFrame(() => {
      container.animate(
        [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 300,
          easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
          fill: 'forwards'
        }
      );
    });
    
  } catch (error) {
    console.error('Error during page navigation:', error);
    showError('Terjadi kesalahan saat memuat halaman.', containerId);
  }
}

/**
 * Add CSS styles needed for transitions to prevent white flashes
 * This should be called once when your app initializes
 */
function initializeTransitionStyles() {
  // Create style element if it doesn't exist
  let styleEl = document.getElementById('transition-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'transition-styles';
    document.head.appendChild(styleEl);
  }
  
  // Add CSS to prevent white flashes
  styleEl.textContent = `
    /* Prevent white flashes during transitions */
    html, body {
      background-color: var(--bg-color, #ffffff);
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    /* Ensure content containers always have a background */
    #maincontent, 
    .page-container {
      background-color: var(--bg-color, #ffffff);
      min-height: 100vh;
      position: relative;
    }
    
    /* Disable body scrolling during transitions */
    body.transitioning {
      overflow: hidden;
    }
    
    /* Ensure smooth animations */
    * {
      backface-visibility: hidden;
    }
    
    /* Loading state should maintain background */
    .loading {
      background-color: var(--bg-color, #ffffff);
      padding: 2rem;
      text-align: center;
    }
    
    /* Error message styling */
    .error-message {
      background-color: var(--bg-color, #ffffff);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `;
}

export {
  showLoading,
  showError,
  setupImagePreview,
  formatDate,
  pageTransition,
  preloadPage,
  smoothPageNavigation,
  initializeTransitionStyles
};