export interface ValidationError {
  [key: string]: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

export function validatePasswordStrength(password: string): { score: number; feedback: string } {
  let score = 0;
  let feedback = "";

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  const feedbackMap: { [key: number]: string } = {
    0: "Very weak",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
    5: "Very strong",
  };

  feedback = feedbackMap[score] || "Unknown";
  return { score, feedback };
}

export function validateLoginForm(email: string, password: string): ValidationError {
  const errors: ValidationError = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (!validatePassword(password)) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationError {
  const errors: ValidationError = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (!validateName(name)) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (!validatePassword(password)) {
    errors.password = "Password must be at least 8 characters";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
