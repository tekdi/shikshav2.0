// Common validation functions
export const validateEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

export const validatePassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  );
};

export const validateMobile = (mobile: string) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

export const validateName = (name: string) => {
  const hasNumbers = /\d/;
  return !hasNumbers.test(name) && name.trim().split(' ').length >= 2;
};
