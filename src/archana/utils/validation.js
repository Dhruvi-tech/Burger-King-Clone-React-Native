export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  return phone.length >= 10;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};