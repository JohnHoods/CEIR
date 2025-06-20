// Проверка авторизации (по наличию JWT)
export const isAuth = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('jwt');
};
