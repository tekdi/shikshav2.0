// Common validation functions
export const validateEmail = (email: string) =>
  /^[a-zA-Z][a-zA-Z0-9._]{2,}$/.test(email);

export const validatePassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  );

export const validateName = (name: string) => {
  const hasNumbers = /\d/;
  return !hasNumbers.test(name) && name.trim().split(' ').length >= 2;
};
