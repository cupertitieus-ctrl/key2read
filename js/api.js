// key2read API Client
const API = {
  async get(url) {
    const r = await fetch(url);
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      throw new Error(data.error || `API error: ${r.status}`);
    }
    return r.json();
  },
  async post(url, body) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      throw new Error(data.error || `API error: ${r.status}`);
    }
    return r.json();
  },
  async put(url, body) {
    const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      throw new Error(data.error || `API error: ${r.status}`);
    }
    return r.json();
  },

  // Auth
  signup: (data) => API.post('/api/auth/signup', data),
  login: (data) => API.post('/api/auth/login', data),
  demoLogin: (name, email, role) => API.post('/api/auth/demo-login', { name, email, role: role || 'teacher' }),
  googleLogin: (credential) => API.post('/api/auth/google', { credential }),
  cleverLogin: (code) => API.post('/api/auth/clever', { code }),
  getMe: () => API.get('/api/auth/me'),
  logout: () => API.post('/api/auth/logout', {}),
  getClassCode: () => API.get('/api/class/code'),
  validateClassCode: (code) => API.get(`/api/class/validate/${code}`),
  getClassAnalytics: (classId) => API.get(`/api/class/${classId}/analytics`),
  getPopularBooks: (classId) => API.get(`/api/class/${classId}/popular-books`),
  getRecentActivity: (classId) => API.get(`/api/class/${classId}/recent-activity`),
  getRecentPurchases: (classId) => API.get(`/api/class/${classId}/recent-purchases`),

  // Teacher
  startTeacherQuiz: () => API.post('/api/teacher/start-quiz-mode', {}),

  // Students
  getStudents: (classId) => API.get(`/api/students?classId=${classId}`),
  getStudent: (id) => API.get(`/api/students/${id}`),
  updateSurvey: (id, data) => API.put(`/api/students/${id}/survey`, data),
  getReadingHistory: (id) => API.get(`/api/students/${id}/reading-history`),
  getQuizResults: (id) => API.get(`/api/students/${id}/quiz-results`),
  getWeeklyStats: (id) => API.get(`/api/students/${id}/weekly-stats`),
  getStudentPerformance: (id) => API.get(`/api/students/${id}/performance`),
  getBookProgress: (id) => API.get(`/api/students/${id}/book-progress`),
  getFavorites: (id) => API.get(`/api/students/${id}/favorites`),
  toggleFavorite: (id, bookId) => API.post(`/api/students/${id}/favorites/toggle`, { bookId }),

  // Books
  getBooks: () => API.get('/api/books'),
  getChapters: (bookId) => API.get(`/api/books/${bookId}/chapters`),
  getChapterQuiz: (bookId, chapterNum) => API.get(`/api/books/${bookId}/chapters/${chapterNum}/quiz`),
  getFullBookQuiz: (bookId) => API.get(`/api/books/${bookId}/full-quiz`),
  getCompletedChapters: (studentId, bookId) => API.get(`/api/students/${studentId}/completed-chapters/${bookId}`),

  // Quiz
  personalizeAll: (chapterId, studentId) => API.post('/api/quiz/personalize-all', { chapterId, studentId }),
  submitQuiz: (data) => API.post('/api/quiz/submit', data),

  // AI Features
  defineWord: (word, context, gradeLevel) => API.post('/api/define', { word, context, gradeLevel }),
  getStrategy: (strategyType, question, passage, gradeLevel) => API.post('/api/strategy', { strategyType, question, passage, gradeLevel }),
  getFeedback: (data) => API.post('/api/feedback', data),

  // Store
  getStoreItems: (classId) => API.get(`/api/store/items?classId=${classId}`),
  createStoreItem: (data) => API.post('/api/store/items', data),
  updateStoreItem: (id, data) => API.put(`/api/store/items/${id}`, data),
  deleteStoreItem: (id) => fetch(`/api/store/items/${id}`, { method: 'DELETE' }).then(r => r.json()),
  uploadStoreImage: (imageData, filename) => API.post('/api/store/upload-image', { imageData, filename }),
  getRewardGallery: () => API.get('/api/store/gallery'),
  addRewardGallery: (data) => API.post('/api/store/gallery', data),
  deleteRewardGallery: (id) => fetch(`/api/store/gallery/${id}`, { method: 'DELETE' }).then(r => r.json()),
  purchaseReward: (data) => API.post('/api/store/purchase', data),

  // Assignments
  createAssignment: (data) => API.post('/api/assignments', data),
  getAssignments: (classId) => API.get(`/api/assignments?classId=${classId}`),

  // Owner
  getOwnerStats: () => API.get('/api/owner/stats'),
  getOwnerGenres: () => API.get('/api/owner/genres'),
  getOwnerTeachers: () => API.get('/api/owner/teachers'),
  getOwnerStudents: () => API.get('/api/owner/students'),

  // Status
  getStatus: () => API.get('/api/status')
};
