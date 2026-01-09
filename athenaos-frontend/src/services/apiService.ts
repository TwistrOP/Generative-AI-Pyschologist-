// src/services/apiService.ts
import axios from 'axios';
import type { AuthResponse } from '../types';

export const API_URL = import.meta.env.VITE_API_BASE_URL;

// A function to handle user login
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

// A function to handle user registration
export const registerUser = async (username: string, password: string, email: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    username,
    password,
    email,
  });
  return response.data;
};

export const sendMessage = async (text: string, conversationId: string | null, token: string) => {
  const response = await axios.post(
    `${API_URL}/chat/send-message`,
    { text, conversationId },
    { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 }
  );
  return response.data;
};

export const getEmotionHistory = async (conversationId: string, token: string) => {
  const response = await axios.get(
    `${API_URL}/chat/${conversationId}/emotions`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export const synthesizeSpeech = async (text: string, token: string): Promise<{ audioContent: string }> => {
  const response = await axios.post(
    `${API_URL}/tts/synthesize`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
 