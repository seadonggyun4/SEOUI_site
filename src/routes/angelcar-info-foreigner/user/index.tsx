import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import './style.scss';

export default component$(() => {
  const userName = useSignal('');
  const userEmail = useSignal('');
  const isLoading = useSignal(false);

  useVisibleTask$(() => {
    try {
      const foreignerAppData = sessionStorage.getItem('foreignerApp');
      if (foreignerAppData) {
        const parsedData = JSON.parse(foreignerAppData);
        if (parsedData.userName && parsedData.userName.trim()) {
          if (confirm('You are already logged in. Do you want to continue to the main page?')) {
            window.location.href = '/angelcar-info-foreigner/info';
          }
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  });

  const handleSubmit = $((e: SubmitEvent) => {
    e.preventDefault();

    if (!userName.value.trim() || !userEmail.value.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.value)) {
      alert('Please enter a valid email address');
      return;
    }

    isLoading.value = true;

    // 세션스토리지에 사용자 정보 저장
    const userData = {
      userName: userName.value,
      userEmail: userEmail.value,
      loginTime: new Date().toISOString(),
      userId: Math.random().toString(36).substr(2, 9)
    };

    sessionStorage.setItem('foreignerApp', JSON.stringify(userData));

    isLoading.value = false;
    window.location.href = '/angelcar-info-foreigner/info';
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
              class={`login-btn`}
            >
              <span>Login</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
});