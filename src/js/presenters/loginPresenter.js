export class LoginPresenter {
  constructor(model, view) {
    if (!view) {
      throw new Error('View is required for LoginPresenter');
    }
    this.model = model;
    this.view = view;
    console.log('LoginPresenter initialized with view:', view);
  }

  async handleLogin(email, password) {
    try {
      const response = await this.model.login(email, password);
      
      if (!response.error) {
        localStorage.setItem('token', response.loginResult.token);
        this.view.showSuccess('Login berhasil!');
        this.view.redirectToHome();
      } else {
        this.view.showError('Login gagal: ' + response.message);
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
      this.view.showError('Terjadi kesalahan saat login');
    }
  }

  async handleRegister(name, email, password) {
    try {
      const response = await this.model.register(name, email, password);
      
      if (!response.error) {
        this.view.showSuccess('Registrasi berhasil! Silakan login.');
        this.view.switchToLoginTab(email);
      } else {
        this.view.showError('Registrasi gagal: ' + response.message);
      }
    } catch (error) {
      console.error('Error in handleRegister:', error);
      this.view.showError('Terjadi kesalahan saat registrasi');
    }
  }
} 