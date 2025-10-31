import { User } from '@/contexts/AuthContext';

// API base URL - consider moving to environment variable
const API_URL = 'http://localhost:8000/api';

// API response types
interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

interface UserResponse {
  user: User;
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Helper function to get auth headers
const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Register a new user
export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

// Logout user
export const logout = async (token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Logout failed');
  }
};

// Get authenticated user
export const getUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  const data: UserResponse = await response.json();

  if (!response.ok) {
    throw new Error('Failed to get user');
  }

  return data.user;
};

// Check if user is authenticated (validates token)
export const checkAuth = async (token: string): Promise<boolean> => {
  try {
    await getUser(token);
    return true;
  } catch (error) {
    return false;
  }
};
