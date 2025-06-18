import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-reset-password',
  standalone:false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email = localStorage.getItem('email') || '';
  newPassword: string = '';
  confirmPassword: string = '';
  rememberMe: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  passwordFieldType: string = 'password';
  oobCode: string = ''; // Thêm thuộc tính oobCode
  currentPassword: string = ''; // Thêm cho cách 2 (nếu cần)

  constructor(
    private router: Router, 
    private authService: AuthService,
    private afAuth: AngularFireAuth // Thêm AngularFireAuth
  ) {}

  ngOnInit() {
  // Extract the full URL path
  const fullPath = window.location.pathname + window.location.search;
  
  // Check if this is a Firebase auth URL
  if (fullPath.includes('/__/auth/action')) {
    // Parse the URL to get parameters
    const url = new URL(window.location.href);
    this.oobCode = url.searchParams.get('oobCode') || '';
    this.email = url.searchParams.get('email') || localStorage.getItem('resetEmail') || '';
  } else {
    // Fallback to regular query parameters
    const urlParams = new URLSearchParams(window.location.search);
    this.oobCode = urlParams.get('oobCode') || '';
    this.email = urlParams.get('email') || localStorage.getItem('resetEmail') || '';
  }
  
  console.log('Extracted oobCode:', this.oobCode); // Debug logging
  console.log('Full URL:', window.location.href);
console.log('Path:', window.location.pathname);
console.log('Search:', window.location.search);
}

  onResetPassword() {
  if (!this.newPassword || !this.confirmPassword) {
    this.showPopupMessage('Please fill in all required fields!');
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    this.showPopupMessage('Passwords do not match!');
    return;
  }

  if (this.oobCode) {
    console.log('Attempting to reset password with oobCode:', this.oobCode);
    this.afAuth.confirmPasswordReset(this.oobCode, this.newPassword)
      .then(() => {
        console.log('Password reset successful');
        this.showPopupMessage('Password reset successful!');
        localStorage.removeItem('resetEmail');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      })
      .catch((error) => {
        console.error('Password reset error:', error);
        let errorMessage = 'Password reset failed. Please try again!';

        if (error.code === 'auth/invalid-action-code') {
          errorMessage = 'The password reset link is invalid or has expired. Please request a new link.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password must be at least 6 characters long.';
        }

        this.showPopupMessage(errorMessage);
      });
  } else {
    console.error('No oobCode found');
    this.showPopupMessage('Invalid password reset link. Please request a new one.');
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
}