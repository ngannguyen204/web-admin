import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone:false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  isConfirmStep: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}
onSubmit() {
  if (!this.email.trim()) {
    this.showPopupMessage('Please enter your email!');
    return;
  }

  console.log('Checking email:', this.email); 
  this.authService.checkEmailExists(this.email).subscribe({
    next: (exists) => {
      console.log('Email exists:', exists); 
      if (exists) {
        localStorage.setItem('email', this.email);
        this.showPopupMessage('Password reset email has been sent!');
        setTimeout(() => {
          this.router.navigate(['/confirm-code']);
        }, 1500);
      } else {
        this.showPopupMessage('This email is not registered!');
      }
    },
    error: (err) => {
      console.error('Error checking email:', err);
      this.showPopupMessage('Error checking email. Please try again!');
    }
  });
}
  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}