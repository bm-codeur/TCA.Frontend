import { create } from 'zustand';

const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user && user !== 'undefined' ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: getUser(),

  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;