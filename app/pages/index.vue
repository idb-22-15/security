<script setup>
import { ref, computed, onMounted } from 'vue'

// Состояние приложения
const currentUser = ref(null)
const currentView = ref('users')
const users = ref([])

// Форма входа
const loginForm = ref({
  username: '',
  password: ''
})
const loginError = ref('')
const loginAttempts = ref(0)

// Добавление пользователя
const newUsername = ref('')
const addUserError = ref('')

// Смена пароля
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordError = ref('')
const passwordSuccess = ref('')

// Вычисляемые свойства
const isAdmin = computed(() => currentUser.value?.username === 'ADMIN')

// Инициализация
onMounted(() => {
  loadUsers()
})

// Загрузка пользователей из localStorage
function loadUsers() {
  const savedUsers = localStorage.getItem('users')
  if (savedUsers) {
    users.value = JSON.parse(savedUsers)
  } else {
    // Создание администратора по умолчанию
    users.value = [{
      username: 'ADMIN',
      password: '',
      blocked: false,
      passwordRestrictions: false
    }]
    saveUsers()
  }
}

// Сохранение пользователей в localStorage
function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users.value))
}

// Вход в систему
function login() {
  loginError.value = ''
  
  const user = users.value.find(u => u.username === loginForm.value.username)
  
  if (!user) {
    loginError.value = 'Пользователь не найден'
    return
  }
  
  if (user.blocked) {
    loginError.value = 'Учетная запись заблокирована'
    return
  }
  
  if (user.password === '') {
    // Первый вход - требуется установка пароля
    currentUser.value = user
    currentView.value = 'changePassword'
    passwordError.value = 'Необходимо установить пароль при первом входе'
    return
  }
  
  if (user.password !== loginForm.value.password) {
    loginAttempts.value++
    loginError.value = 'Неверный пароль'
    
    if (loginAttempts.value >= 3) {
      alert('Превышено количество попыток входа. Программа будет закрыта.')
      exitApp()
    }
    return
  }
  
  // Успешный вход
  currentUser.value = user
  loginAttempts.value = 0
  loginForm.value = { username: '', password: '' }
  currentView.value = isAdmin.value ? 'users' : 'changePassword'
}

// Выход из системы
function logout() {
  currentUser.value = null
  currentView.value = 'users'
  loginForm.value = { username: '', password: '' }
  loginError.value = ''
  loginAttempts.value = 0
}

// Выход из приложения
function exitApp() {
  if (confirm('Вы действительно хотите выйти из программы?')) {
    window.close()
    // Если window.close() не работает (браузер блокирует), показываем сообщение
    alert('Закройте вкладку браузера для выхода из программы')
  }
}

// Добавление пользователя
function addUser() {
  addUserError.value = ''
  
  if (!newUsername.value.trim()) {
    addUserError.value = 'Введите имя пользователя'
    return
  }
  
  if (users.value.find(u => u.username === newUsername.value)) {
    addUserError.value = 'Пользователь с таким именем уже существует'
    return
  }
  
  users.value.push({
    username: newUsername.value,
    password: '',
    blocked: false,
    passwordRestrictions: false
  })
  
  saveUsers()
  newUsername.value = ''
  addUserError.value = ''
}

// Блокировка/разблокировка пользователя
function toggleBlock(user) {
  user.blocked = !user.blocked
  saveUsers()
}

// Включение/отключение ограничений на пароль
function toggleRestrictions(user) {
  user.passwordRestrictions = !user.passwordRestrictions
  saveUsers()
}

// Валидация пароля (Вариант 14)
function validatePassword(password) {
  if (!password) {
    return 'Пароль не может быть пустым'
  }
  
  if (!currentUser.value.passwordRestrictions) {
    return null // Ограничения отключены
  }
  
  // Проверка наличия строчных букв
  const hasLowerCase = /[a-zа-яё]/.test(password)
  if (!hasLowerCase) {
    return 'Пароль должен содержать строчные буквы'
  }
  
  // Проверка наличия прописных букв
  const hasUpperCase = /[A-ZА-ЯЁ]/.test(password)
  if (!hasUpperCase) {
    return 'Пароль должен содержать прописные буквы'
  }
  
  // Проверка наличия знаков арифметических операций
  const hasArithmeticOps = /[+\-*/%]/.test(password)
  if (!hasArithmeticOps) {
    return 'Пароль должен содержать знаки арифметических операций (+, -, *, /, %)'
  }
  
  return null
}

// Смена пароля
function changePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''
  
  // Проверка старого пароля (если он установлен)
  if (currentUser.value.password && passwordForm.value.oldPassword !== currentUser.value.password) {
    passwordError.value = 'Неверный старый пароль'
    return
  }
  
  // Проверка совпадения нового пароля и подтверждения
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Пароли не совпадают'
    return
  }
  
  // Валидация нового пароля
  const validationError = validatePassword(passwordForm.value.newPassword)
  if (validationError) {
    passwordError.value = validationError
    return
  }
  
  // Обновление пароля
  const userIndex = users.value.findIndex(u => u.username === currentUser.value.username)
  users.value[userIndex].password = passwordForm.value.newPassword
  currentUser.value.password = passwordForm.value.newPassword
  
  saveUsers()
  
  passwordSuccess.value = 'Пароль успешно изменен'
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  
  setTimeout(() => {
    passwordSuccess.value = ''
  }, 3000)
}

// Отмена смены пароля
function cancelPasswordChange() {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
  passwordSuccess.value = ''
  
  // Если это первый вход и пароль не установлен, выходим
  if (!currentUser.value.password) {
    logout()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Окно входа -->
    <div v-if="!currentUser" class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 class="text-2xl font-bold text-center mb-6 text-slate-800">Вход в систему</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Имя пользователя</label>
            <input
              v-model="loginForm.username"
              type="text"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="login"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Пароль</label>
            <input
              v-model="loginForm.password"
              type="password"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="login"
            >
          </div>
          <div v-if="loginError" class="text-red-600 text-sm">
            {{ loginError }}
            <div v-if="loginAttempts > 0" class="text-xs mt-1">
              Осталось попыток: {{ 3 - loginAttempts }}
            </div>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              @click="login"
            >
              Войти
            </button>
            <button
              class="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              @click="exitApp"
            >
              Выход
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Главное окно приложения -->
    <div v-else class="min-h-screen">
      <!-- Меню -->
      <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-8">
              <h1 class="text-xl font-bold text-slate-800">
                Система аутентификации
              </h1>
              <div class="flex space-x-1">
                <button
                  v-if="isAdmin"
                  class="px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  :class="currentView === 'users' ? 'bg-slate-100' : ''"
                  @click="currentView = 'users'"
                >
                  Пользователи
                </button>
                <button
                  class="px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  :class="currentView === 'changePassword' ? 'bg-slate-100' : ''"
                  @click="currentView = 'changePassword'"
                >
                  Сменить пароль
                </button>
                <button
                  class="px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  :class="currentView === 'about' ? 'bg-slate-100' : ''"
                  @click="currentView = 'about'"
                >
                  О программе
                </button>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-slate-600">
                Пользователь: <span class="font-semibold">{{ currentUser.username }}</span>
                <span v-if="isAdmin" class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">ADMIN</span>
              </span>
              <button
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                @click="logout"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Контент -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Управление пользователями (только для ADMIN) -->
        <div v-if="currentView === 'users' && isAdmin" class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-6 text-slate-800">Управление пользователями</h2>
            
            <!-- Добавление нового пользователя -->
            <div class="mb-6 p-4 bg-slate-50 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-slate-700">Добавить пользователя</h3>
              <div class="flex gap-3">
                <input
                  v-model="newUsername"
                  type="text"
                  placeholder="Имя нового пользователя"
                  class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <button
                  class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  @click="addUser"
                >
                  Добавить
                </button>
              </div>
              <div v-if="addUserError" class="text-red-600 text-sm mt-2">{{ addUserError }}</div>
            </div>

            <!-- Список пользователей -->
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-slate-700">Список пользователей</h3>
              <div
                v-for="user in users"
                :key="user.username"
                class="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <span class="font-semibold text-slate-800">{{ user.username }}</span>
                      <span
                        v-if="user.username === 'ADMIN'"
                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        Администратор
                      </span>
                      <span
                        v-if="user.blocked"
                        class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        Заблокирован
                      </span>
                      <span
                        v-if="user.passwordRestrictions"
                        class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                      >
                        Ограничения на пароль
                      </span>
                    </div>
                    <div class="text-sm text-slate-500 mt-1">
                      Пароль: {{ user.password ? '********' : '(не установлен)' }}
                    </div>
                  </div>
                  <div v-if="user.username !== 'ADMIN'" class="flex gap-2">
                    <button
                      class="px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      :class="user.blocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'"
                      @click="toggleBlock(user)"
                    >
                      {{ user.blocked ? 'Разблокировать' : 'Заблокировать' }}
                    </button>
                    <button
                      class="px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      :class="user.passwordRestrictions ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'"
                      @click="toggleRestrictions(user)"
                    >
                      {{ user.passwordRestrictions ? 'Отключить ограничения' : 'Включить ограничения' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Смена пароля -->
        <div v-if="currentView === 'changePassword'" class="max-w-2xl mx-auto">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-6 text-slate-800">Смена пароля</h2>
            <div class="space-y-4">
              <div v-if="currentUser.password">
                <label class="block text-sm font-medium text-slate-700 mb-2">Старый пароль</label>
                <input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Новый пароль</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Подтвердите новый пароль</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              
              <!-- Информация об ограничениях -->
              <div v-if="currentUser.passwordRestrictions" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-800 font-medium mb-2">Требования к паролю (Вариант 14):</p>
                <ul class="text-sm text-yellow-700 list-disc list-inside space-y-1">
                  <li>Наличие строчных букв (a-z, а-я)</li>
                  <li>Наличие прописных букв (A-Z, А-Я)</li>
                  <li>Наличие знаков арифметических операций (+, -, *, /, %)</li>
                </ul>
              </div>

              <div v-if="passwordError" class="text-red-600 text-sm">{{ passwordError }}</div>
              <div v-if="passwordSuccess" class="text-green-600 text-sm">{{ passwordSuccess }}</div>
              
              <div class="flex gap-3">
                <button
                  class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  @click="changePassword"
                >
                  Сменить пароль
                </button>
                <button
                  class="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                  @click="cancelPasswordChange"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- О программе -->
        <div v-if="currentView === 'about'" class="max-w-2xl mx-auto">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-6 text-slate-800">О программе</h2>
            <div class="space-y-4 text-slate-700">
              <p><strong>Название:</strong> Программа разграничения полномочий пользователей</p>
              <p><strong>Лабораторная работа:</strong> №1</p>
              <p><strong>Вариант:</strong> 14</p>
              <p><strong>Индивидуальное задание:</strong> Ограничения на пароли - наличие строчных и прописных букв, а также знаков арифметических операций (+, -, *, /, %)</p>
              <p><strong>Технологии:</strong> Vue 3, Tailwind CSS</p>
              <div class="mt-6 p-4 bg-slate-50 rounded-lg">
                <p class="font-semibold mb-2">Возможности программы:</p>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Парольная аутентификация пользователей</li>
                  <li>Два режима работы: администратор (ADMIN) и обычный пользователь</li>
                  <li>Управление учетными записями (добавление, блокировка)</li>
                  <li>Настройка ограничений на пароли</li>
                  <li>Смена паролей с подтверждением</li>
                  <li>Сохранение данных в локальном хранилище</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

