import axios from 'axios';

import { API_BASE_URL } from 'config/api'

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    console.error('API error:', error.response?.data?.message);
    throw new Error(error.response?.data?.message || 'An error occurred');
  } else {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
};

interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async (mail: Mail): Promise<void> => {
  try {
    await axios.post<void>(`${API_BASE_URL}/email/send`, mail, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  } catch (error) {
    handleApiError(error);
  }
};
