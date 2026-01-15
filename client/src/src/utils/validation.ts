export const validatePlateNumber = (plate: string): boolean => {
  // Rwandan plate format example: RA A 123 A or similar
  // For exam, just ensure it's not empty and has reasonable length
  return plate.length >= 5 && plate.length <= 10;
};
export const validatePhone = (phone: string): boolean => {
  // Rwandan phone format: 07... (10 digits)
  const phoneRegex = /^07\d{8}$/;
  return phoneRegex.test(phone);
};
export const validateYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1990 && year <= currentYear;
};
export const validatePrice = (price: number): boolean => {
  return price >= 0;
};