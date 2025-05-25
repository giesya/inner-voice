// Database configuration
const DB_NAME = 'InnerVoiceDB';
const DB_VERSION = 2; // Increment version to force upgrade
const STORES = {
  STORIES: 'stories',
  PUSH_SUBSCRIPTIONS: 'pushSubscriptions',
  USER_PREFERENCES: 'userPreferences'
};

// Custom error class for database operations
class DatabaseError extends Error {
  constructor(message, operation) {
    super(message);
    this.name = 'DatabaseError';
    this.operation = operation;
  }
}

let dbInstance = null;

// Initialize database
const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      console.log('Using existing database connection');
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening database:', request.error);
      reject(new DatabaseError('Failed to open database', request.error));
    };

    request.onsuccess = () => {
      console.log('Database opened successfully');
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log('Database upgrade needed');

      // Delete existing stores if they exist
      if (db.objectStoreNames.contains(STORES.STORIES)) {
        db.deleteObjectStore(STORES.STORIES);
      }
      if (db.objectStoreNames.contains(STORES.PUSH_SUBSCRIPTIONS)) {
        db.deleteObjectStore(STORES.PUSH_SUBSCRIPTIONS);
      }
      if (db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
        db.deleteObjectStore(STORES.USER_PREFERENCES);
      }

      // Create stories store
      const storiesStore = db.createObjectStore(STORES.STORIES, { keyPath: 'id', autoIncrement: true });
      storiesStore.createIndex('createdAt', 'createdAt', { unique: false });
      storiesStore.createIndex('userId', 'userId', { unique: false });
      console.log('Stories store created');

      // Create push subscriptions store
      db.createObjectStore(STORES.PUSH_SUBSCRIPTIONS, { keyPath: 'id' });
      console.log('Push subscriptions store created');

      // Create user preferences store
      const prefsStore = db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'id' });
      prefsStore.createIndex('userId', 'userId', { unique: true });
      console.log('User preferences store created');

      // Create default preferences
      const defaultPrefs = {
        id: 'default',
        notifications: {
          enabled: false,
          newStories: true,
          comments: true,
          mentions: true
        },
        theme: 'light',
        language: 'id'
      };
      prefsStore.add(defaultPrefs);
      console.log('Default preferences created');
    };
  });
};

// Generic function to save data
const saveData = async (storeName, data) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new DatabaseError('Failed to save data', 'save'));
    });
  } catch (error) {
    throw new DatabaseError(`Error saving data to ${storeName}: ${error.message}`, 'save');
  }
};

// Generic function to get data
const getData = async (storeName, key) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = key ? store.get(key) : store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new DatabaseError('Failed to get data', 'get'));
    });
  } catch (error) {
    throw new DatabaseError(`Error getting data from ${storeName}: ${error.message}`, 'get');
  }
};

// Generic function to delete data
const deleteData = async (storeName, key) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new DatabaseError('Failed to delete data', 'delete'));
    });
  } catch (error) {
    throw new DatabaseError(`Error deleting data from ${storeName}: ${error.message}`, 'delete');
  }
};

// Story-specific functions
const saveStory = async (story) => {
  const storyWithTimestamp = {
    ...story,
    createdAt: new Date().toISOString()
  };
  return saveData(STORES.STORIES, storyWithTimestamp);
};

const getAllStories = async () => {
  return getData(STORES.STORIES);
};

const deleteStory = async (id) => {
  return deleteData(STORES.STORIES, id);
};

// User preferences functions
const saveUserPreferences = async (preferences) => {
  const defaultPreferences = {
    id: 'default',
    notifications: {
      enabled: false,
      newStories: true,
      comments: true,
      mentions: true
    },
    theme: 'light',
    language: 'id'
  };

  const updatedPreferences = {
    ...defaultPreferences,
    ...preferences,
    id: 'default' // Ensure ID is always 'default'
  };

  return saveData(STORES.USER_PREFERENCES, updatedPreferences);
};

const getUserPreferences = async () => {
  try {
    const prefs = await getData(STORES.USER_PREFERENCES, 'default');
    if (!prefs) {
      // Create default preferences if none exist
      const defaultPrefs = {
        id: 'default',
        notifications: {
          enabled: false,
          newStories: true,
          comments: true,
          mentions: true
        },
        theme: 'light',
        language: 'id'
      };
      await saveData(STORES.USER_PREFERENCES, defaultPrefs);
      return defaultPrefs;
    }
    return prefs;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    // Return default preferences if there's an error
    return {
      id: 'default',
      notifications: {
        enabled: false,
        newStories: true,
        comments: true,
        mentions: true
      },
      theme: 'light',
      language: 'id'
    };
  }
};

// Push subscription functions
const savePushSubscription = async (subscription) => {
  const subscriptionData = {
    id: 'default',
    ...subscription
  };
  return saveData(STORES.PUSH_SUBSCRIPTIONS, subscriptionData);
};

const getPushSubscription = async () => {
  return getData(STORES.PUSH_SUBSCRIPTIONS, 'default');
};

const deletePushSubscription = async () => {
  return deleteData(STORES.PUSH_SUBSCRIPTIONS, 'default');
};

export {
  initDB,
  saveStory,
  getAllStories,
  deleteStory,
  saveUserPreferences,
  getUserPreferences,
  savePushSubscription,
  getPushSubscription,
  deletePushSubscription,
  DatabaseError
}; 