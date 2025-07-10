// user/index.tsx
import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import { loginUser, checkAuthStatus, validateEmail } from '../store/authUtils';
import './style.scss';

export default component$(() => {
  const userName = useSignal('');
  const userEmail = useSignal('');
  const isLoading = useSignal(false);

  // 이미 로그인된 사용자 확인
  useVisibleTask$(() => {
    const userData = checkAuthStatus();
    if (userData) {
      if (confirm('You are already logged in. Do you want to continue to the main page?')) {
        window.location.href = '/angelcar-info-foreigner/info';
      }
    }
  });

  const handleSubmit = $((e: SubmitEvent) => {
    e.preventDefault();

    if (!userName.value.trim() || !userEmail.value.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!validateEmail(userEmail.value)) {
      alert('Please enter a valid email address');
      return;
    }

    isLoading.value = true;

    try {
      loginUser({
        userName: userName.value,
        userEmail: userEmail.value
      });

      isLoading.value = false;
      window.location.href = '/angelcar-info-foreigner/info';
    } catch (error) {
      isLoading.value = false;
      alert('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  });

  const handleInputChange = $((field: 'userName' | 'userEmail', value: string) => {
    if (field === 'userName') {
      userName.value = value;
    } else {
      userEmail.value = value;
    }
  });

  return (
    <div class="container">
      {/* Header Section */}
      <header class="header">
        <div class="logo-container">
          <img src="/angelcar-info-foreigner/img/logo.png" alt="JEJU ANGEL RENT A CAR" />
        </div>
      </header>

      {/* Main Content */}
      <main class="main-content">
        <div class="login-section">
          <h2 class="login-title">Welcome</h2>
          <p class="login-subtitle">Please enter your information to continue</p>

          <form class="login-form" preventdefault:submit onSubmit$={handleSubmit}>
            <div class="input-group">
              <label for="userName">Name</label>
              <input
                type="text"
                id="userName"
                name="userName"
                placeholder="Enter your name"
                value={userName.value}
                onInput$={(e) => handleInputChange('userName', (e.target as HTMLInputElement).value)}
                required
                disabled={isLoading.value}
              />
              <i class="fas fa-user input-icon"></i>
            </div>

            <div class="input-group">
              <label for="userEmail">Email</label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                placeholder="Enter your email"
                value={userEmail.value}
                onInput$={(e) => handleInputChange('userEmail', (e.target as HTMLInputElement).value)}
                required
                disabled={isLoading.value}
              />
              <i class="fas fa-envelope input-icon"></i>
            </div>

            <button
              type="submit"
              class="login-btn"
              disabled={isLoading.value}
            >
              <span>{isLoading.value ? 'Loading...' : 'Login'}</span>
              <i class="fas fa-arrow-right"></i>
            </button>
            <a href='/angelcar-info-foreigner/info/' class="login-subtitle">
              Return to Announcement
            </a>
          </form>
        </div>
      </main>
    </div>
  );
});