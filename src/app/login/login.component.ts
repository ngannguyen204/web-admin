import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  passwordFieldType: string = 'password';
  showPopup: boolean = false;
  popupMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

async onSubmit() {
  if (!this.email || !this.password) {
    this.showPopupMessage('Please fill in all fields!');
    return;
  }

  this.isLoading = true;
  const normalizedEmail = this.email.toLowerCase().trim();

  try {
    const userCredential = await this.authService.login(normalizedEmail, this.password);
    
    // Kiểm tra localStorage để chắc chắn
    const adminData = localStorage.getItem('adminAuth');
    if (!adminData) {
      throw new Error('Admin session not established');
    }

    if (this.rememberMe) {
      localStorage.setItem('rememberedUser', JSON.stringify({
        email: this.email,
        rememberMe: true
      }));
    }

    this.router.navigate(['/dashboard']);

  } catch (error: any) {
    console.error('Login error:', error);
    this.handleLoginError(error);
  } finally {
    this.isLoading = false;
  }
}

  

  private handleLoginError(error: any) {
    let errorMessage = 'Login failed. Please try again';
    
    const errorMap: {[key: string]: string} = {
      'auth/user-not-found': 'Email does not exist',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-email': 'Invalid email format',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/user-disabled': 'This account has been disabled',
      'PERMISSION_DENIED': 'You do not have permission to access the database. Please contact administrator.'
    };
    
    errorMessage = errorMap[error.code] || error.message || errorMessage;
    this.showPopupMessage(errorMessage);
  }

  
  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  ngOnInit() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const user = JSON.parse(rememberedUser);
      this.email = user.email;
      this.rememberMe = user.rememberMe;
    }
  }
}