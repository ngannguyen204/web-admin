import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

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
      
      if (!userCredential?.user) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      console.log('Firebase Auth User:', userCredential.user.email);

      
      if (this.rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          email: this.email,
          rememberMe: true
        }));
      } else {
        localStorage.removeItem('rememberedUser');
      }

      //  Save token
      localStorage.setItem('token', await userCredential.user.getIdToken());

      
      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again';
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Email does not exist';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Please try again later';
            break;
          default:
            errorMessage = `System error: ${error.code || error.message}`;
        }
      }
      
      this.showPopupMessage(errorMessage);
    } finally {
      this.isLoading = false;
    }
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