// Модуль для шифрования/расшифрования данных с использованием MD5 и AES-CBC
// Лабораторная работа №3: Блочное шифрование с режимом CBC и добавлением salt

import CryptoJS from 'crypto-js'

export function md5(str: string): string {
  return CryptoJS.MD5(str).toString()
}

/**
 * Шифрование данных с использованием AES-CBC
 * - Блочное шифрование
 * - Режим CBC (Cipher Block Chaining - Сцепление блоков шифра)
 * - Автоматическое добавление случайного salt
 * - MD5 хеширование парольной фразы
 */
export function encryptData(data: string, passphrase: string): string {
  try {
    // Хешируем парольную фразу с MD5
    const hashedPassphrase = md5(passphrase)

    const encrypted = CryptoJS.AES.encrypt(data, hashedPassphrase, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding,
    })

    return encrypted.toString()
  }
  catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Ошибка шифрования данных')
  }
}

export function decryptData(encryptedData: string, passphrase: string): {
  success: true
  data: string
} | {
  success: false
  message: string
} {
  try {
    const hashedPassphrase = md5(passphrase)

    const decrypted = CryptoJS.AES.decrypt(encryptedData, hashedPassphrase, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    })

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)

    if (!decryptedStr) {
      return {
        success: false as const,
        message: 'Ошибка расшифрования данных.',
      }
    }

    return { success: true as const, data: decryptedStr }
  }
  catch {
    return {
      success: false as const,
      message: 'Ошибка расшифрования данных.',
    }
  }
}

export function hashPassword(password: string): string {
  return md5(password)
}

export function verifyPassword(password: string, hash: string): boolean {
  return md5(password) === hash
}
