import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@tutoring_user',
  STUDENT_PROGRESS: '@tutoring_student_progress',
  CHAT_HISTORY: '@tutoring_chat_history',
  LESSONS: '@tutoring_lessons',
};

// ==================== User Storage ====================

export async function saveUser(userData: any): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

export async function getUser(): Promise<any | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
}

export async function clearUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error clearing user:', error);
  }
}

// ==================== Student Progress Storage ====================

export async function saveStudentProgress(progress: any): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENT_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving student progress:', error);
  }
}

export async function getStudentProgress(): Promise<any | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT_PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving student progress:', error);
    return null;
  }
}

// ==================== Chat History Storage ====================

export async function saveChatMessage(message: any): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    const messages = existing ? JSON.parse(existing) : [];
    messages.push(message);
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
}

export async function getChatHistory(): Promise<any[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return [];
  }
}

export async function clearChatHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
}

// ==================== Lessons Storage ====================

export async function saveLessons(lessons: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  } catch (error) {
    console.error('Error saving lessons:', error);
  }
}

export async function getLessons(): Promise<any[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LESSONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving lessons:', error);
    return [];
  }
}

// ==================== Clear All ====================

export async function clearAllStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing all storage:', error);
  }
}
