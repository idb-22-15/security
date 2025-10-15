// Вариант 14: Наличие строчных и прописных букв, а также знаков арифметических операций

export interface ValidationResult {
  isValid: boolean
  message: string
}

export function validatePassword(password: string, hasRestrictions: boolean): ValidationResult {
  if (!hasRestrictions) {
    return { isValid: true, message: '' }
  }

  // Проверка на строчные буквы (латиница и кириллица)
  const hasLowercase = /[a-zа-яё]/.test(password)

  // Проверка на прописные буквы (латиница и кириллица)
  const hasUppercase = /[A-ZА-ЯЁ]/.test(password)

  // Проверка на знаки арифметических операций
  const hasArithmeticOps = /[+\-*/%]/.test(password)

  if (!hasLowercase) {
    return {
      isValid: false,
      message: 'Пароль должен содержать строчные буквы',
    }
  }

  if (!hasUppercase) {
    return {
      isValid: false,
      message: 'Пароль должен содержать прописные буквы',
    }
  }

  if (!hasArithmeticOps) {
    return {
      isValid: false,
      message: 'Пароль должен содержать знаки арифметических операций (+, -, *, /, %)',
    }
  }

  return { isValid: true, message: '' }
}
