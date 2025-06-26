
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit 
{
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  passwordFieldType: string = 'password';
  showPopup: boolean = false;
  popupMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}
async onSubmit() {
  if (!this.email || !this.password) {
    this.showPopupMessage('Please fill in all required fields!');
    return;
  }

  this.isLoading = true;
  const normalizedEmail = this.email.toLowerCase().trim();

  try {
    await this.authService.cleanUpSession();
    
    // 1. Perform Firebase authentication
    const userCredential = await this.authService.login(normalizedEmail, this.password);
    console.log('Firebase auth successful', userCredential.user?.uid);

    // 2. Verify admin status and get token
    const adminToken = this.authService.getAdminToken();
    console.log('Admin token after login:', adminToken);
    
    if (!adminToken) {
      // Additional check if token is missing but UID is mapped
      const isAdmin = await this.authService.isAdmin().pipe(take(1)).toPromise();
      if (!isAdmin) {
        throw new Error('Unable to establish admin session');
      }
      // If isAdmin is true but token missing, reload token
      const reloadedToken = this.authService.getAdminToken();
      if (!reloadedToken) {
        throw new Error('Admin session token missing');
      }
    }

    if (this.rememberMe) {
      localStorage.setItem('rememberedUser', JSON.stringify({
        email: this.email,
        rememberMe: true
      }));
    } else {
      localStorage.removeItem('rememberedUser');
    }

    this.router.navigate(['/dashboard']);
  } catch (error: any) {
    console.error('Login error:', error);
    this.handleLoginError(error);
  } finally {
    this.isLoading = false;
  }
}
  /*async onSubmit() {
  if (!this.email || !this.password) {
    this.showPopupMessage('Please fill in all required fields!');
    return;
  }

  this.isLoading = true;
  const normalizedEmail = this.email.toLowerCase().trim();

  try {
    // Force complete cleanup before attempting login
    await this.authService.cleanUpSession(); 
    
    const userCredential = await this.authService.login(normalizedEmail, this.password);
    
    const adminData = this.authService.getAdminToken();
    if (!adminData) {
      throw new Error('Unable to establish admin session');
    }

    if (this.rememberMe) {
      localStorage.setItem('rememberedUser', JSON.stringify({
        email: this.email,
        rememberMe: true
      }));
    } else {
      localStorage.removeItem('rememberedUser');
    }

    this.router.navigate(['/dashboard']);
  } catch (error: any) {
    console.error('Login error:', error);
    this.handleLoginError(error);
  } finally {
    this.isLoading = false;
  }
}*/

  private handleLoginError(error: any) {
    let errorMessage = 'Login failed. Please try again.';

    const errorMap: { [key: string]: string } = {
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/user-not-found': 'Email does not exist.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-email': 'Invalid email format.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/user-disabled': 'Account has been disabled.',
      'PERMISSION_DENIED': 'Access denied. Please contact the administrator.',
      'Admin session not established': 'Unable to verify admin privileges.'
    };

    if (error.code && errorMap[error.code]) {
      errorMessage = errorMap[error.code];
    } else if (error.message && errorMap[error.message]) {
      errorMessage = errorMap[error.message];
    }

    this.showPopupMessage(errorMessage);
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;

    setTimeout(() => {
      this.closePopup();
    }, 5000);
  }

  closePopup() {
    this.showPopup = false;
  }

  ngOnInit() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const user = JSON.parse(rememberedUser);
        if (user.email && user.rememberMe) {
          this.email = user.email;
          this.rememberMe = user.rememberMe;
        }
      } catch (e) {
        console.error('Error reading remembered user data:', e);
        localStorage.removeItem('rememberedUser');
      }
    }

    this.authService.isAdmin().subscribe(isAdmin => {
      if (isAdmin) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
