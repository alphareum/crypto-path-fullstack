// API base URL
const API_URL = 'http://localhost:8000/api';

// Progress record interface
export interface UserProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  lesson?: {
    id: number;
    title: string;
    module_id: number;
  };
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Get all progress for authenticated user
export const getProgress = async (): Promise<UserProgress[]> => {
  const response = await fetch(`${API_URL}/progress`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch progress');
  }

  return response.json();
};

// Mark a lesson as complete
export const markLessonComplete = async (lessonId: number): Promise<UserProgress> => {
  const response = await fetch(`${API_URL}/progress`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ lesson_id: lessonId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to mark lesson complete');
  }

  return response.json();
};

// Mark a lesson as incomplete (remove progress)
export const markLessonIncomplete = async (lessonId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/progress/${lessonId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to mark lesson incomplete');
  }
};

// Check if a lesson is completed (helper function)
export const isLessonCompleted = (progress: UserProgress[], lessonId: number): boolean => {
  return progress.some(p => p.lesson_id === lessonId && p.completed);
};

// Get progress for a specific module (helper function)
export const getModuleProgress = (progress: UserProgress[], moduleId: number): UserProgress[] => {
  return progress.filter(p => p.lesson?.module_id === moduleId);
};

// Calculate completion percentage for a module (helper function)
export const calculateModuleCompletion = (
  progress: UserProgress[],
  moduleId: number,
  totalLessons: number
): number => {
  if (totalLessons === 0) return 0;
  const completedCount = getModuleProgress(progress, moduleId).length;
  return Math.round((completedCount / totalLessons) * 100);
};
