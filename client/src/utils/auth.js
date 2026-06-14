export const getAuthToken = () => {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return localStorage.getItem('token_admin') || localStorage.getItem('token');
  if (path.startsWith('/manager')) return localStorage.getItem('token_manager') || localStorage.getItem('token');
  if (path.startsWith('/instructor')) return localStorage.getItem('token_instructor') || localStorage.getItem('token');
  if (path.startsWith('/student')) return localStorage.getItem('token_student') || localStorage.getItem('token');
  return localStorage.getItem('token');
};

export const getAuthUser = () => {
  const path = window.location.pathname;
  let userStr = null;
  if (path.startsWith('/admin')) userStr = localStorage.getItem('user_admin');
  else if (path.startsWith('/manager')) userStr = localStorage.getItem('user_manager');
  else if (path.startsWith('/instructor')) userStr = localStorage.getItem('user_instructor');
  else if (path.startsWith('/student')) userStr = localStorage.getItem('user_student');

  if (!userStr) userStr = localStorage.getItem('user');
  return JSON.parse(userStr || '{}');
};

export const logout = () => {
  const keys = [
    'token', 'user',
    'token_admin', 'user_admin',
    'token_manager', 'user_manager',
    'token_instructor', 'user_instructor',
    'token_student', 'user_student'
  ];
  keys.forEach(key => localStorage.removeItem(key));
};
