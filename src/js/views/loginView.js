import { LoginModel } from '../models/loginModel.js';
import { pageTransition } from '../utils/helpers.js';

export class LoginView {
  constructor() {
    this.model = new LoginModel();
    this.presenter = null;
  }

  showError(message) {
    alert(message);
  }

  showSuccess(message) {
    alert(message);
  }

  redirectToHome() {
    location.hash = '#/';
  }

  switchToLoginTab(email) {
    const loginTab = document.getElementById('tab-login');
    const loginEmail = document.getElementById('login-email');
    if (loginTab && loginEmail) {
      loginTab.click();
      loginEmail.value = email;
    }
  }

  render() {
    console.log('Rendering login view');
    
    const mainContent = document.getElementById('maincontent');
    if (!mainContent) {
      console.error('Main content element not found');
      return;
    }
    
    mainContent.innerHTML = '';
    pageTransition();

    const authContainer = document.createElement('div');
    authContainer.className = 'auth-container';
    
    // Toggle antara form login dan register
    const tabs = document.createElement('div');
    tabs.className = 'auth-tabs';
    tabs.innerHTML = `
      <button id="tab-login" class="auth-tab active">Login</button>
      <button id="tab-register" class="auth-tab">Daftar</button>
    `;
    authContainer.appendChild(tabs);
    
    // Form login
    const loginForm = document.createElement('form');
    loginForm.id = 'formLogin';
    loginForm.className = 'auth-form active';
    loginForm.innerHTML = `
      <h2>Login</h2>
      
      <div class="form-group">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" required placeholder="email@example.com" />
      </div>
      
      <div class="form-group">
        <label for="login-pass">Password</label>
        <input type="password" id="login-pass" required placeholder="Masukkan password" />
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        <button type="button" class="btn-secondary" onclick="location.hash='#/'">
          <i class="fas fa-times"></i> Batal
        </button>
      </div>
    `;
    authContainer.appendChild(loginForm);
    
    // Form register
    const registerForm = document.createElement('form');
    registerForm.id = 'formRegister';
    registerForm.className = 'auth-form';
    registerForm.style.display = 'none';
    registerForm.innerHTML = `
      <h2>Daftar Akun Baru</h2>
      
      <div class="form-group">
        <label for="register-name">Nama</label>
        <input type="text" id="register-name" required placeholder="Nama lengkap" />
      </div>
      
      <div class="form-group">
        <label for="register-email">Email</label>
        <input type="email" id="register-email" required placeholder="email@example.com" />
      </div>
      
      <div class="form-group">
        <label for="register-pass">Password</label>
        <input type="password" id="register-pass" required placeholder="Minimal 8 karakter" minlength="8" />
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <i class="fas fa-user-plus"></i> Daftar
        </button>
        <button type="button" class="btn-secondary" onclick="location.hash='#/'">
          <i class="fas fa-times"></i> Batal
        </button>
      </div>
    `;
    authContainer.appendChild(registerForm);
    
    mainContent.appendChild(authContainer);
    
    // Store view instance for event listeners
    const view = this;
    
    // Tab switching
    document.getElementById('tab-login').addEventListener('click', () => {
      document.getElementById('tab-login').classList.add('active');
      document.getElementById('tab-register').classList.remove('active');
      document.getElementById('formLogin').style.display = 'block';
      document.getElementById('formRegister').style.display = 'none';
    });
    
    document.getElementById('tab-register').addEventListener('click', () => {
      document.getElementById('tab-login').classList.remove('active');
      document.getElementById('tab-register').classList.add('active');
      document.getElementById('formLogin').style.display = 'none';
      document.getElementById('formRegister').style.display = 'block';
    });
    
    // Login form submission
    document.getElementById('formLogin').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-pass').value.trim();
      
      if (!email || !password) {
        view.showError('Email dan password harus diisi');
        return;
      }
      
      const submitButton = e.target.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      
      try {
        await view.presenter.handleLogin(email, password);
      } catch (error) {
        console.error('Error during login:', error);
        view.showError('Terjadi kesalahan saat login');
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
      }
    });
    
    // Register form submission
    document.getElementById('formRegister').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-pass').value.trim();
      
      if (!name || !email || !password) {
        view.showError('Semua field harus diisi');
        return;
      }
      
      if (password.length < 8) {
        view.showError('Password minimal 8 karakter');
        return;
      }
      
      const submitButton = e.target.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      
      try {
        await view.presenter.handleRegister(name, email, password);
      } catch (error) {
        console.error('Error during registration:', error);
        view.showError('Terjadi kesalahan saat registrasi');
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-user-plus"></i> Daftar';
      }
    });
  }

  showLoginView() {
    this.render();
  }
}