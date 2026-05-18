export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  // Auth
  LOGIN:              '/api/auth/login',
  REGISTER:           '/api/auth/register',
  LOGOUT:             '/api/auth/logout',

  // Assessment
  PRE_ASSESSMENT:     '/api/assessment/pre',
  POST_ASSESSMENT:    '/api/assessment/post',

  // Chat
  CHAT_SEND:          '/api/chat/send',
  CHAT_HISTORY:       '/api/chat/history',

  // Quiz
  QUIZ_GET:           '/api/quiz',
  QUIZ_SUBMIT:        '/api/quiz/submit',

  // Progress
  PROGRESS_REPORT:    '/api/progress/report',
};