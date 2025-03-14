import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';  
  isConfirmStep: boolean = false; // Khai báo biến mặc định là false

  constructor(private router: Router) {}

  onSubmit() {
    if (this.email.trim()) {
      console.log('Email sent to:', this.email);
      this.router.navigate(['/confirm-code']); // Chuyển hướng đến trang Confirm Code
    } else {
      alert("Vui lòng nhập email!");
    }
  }
}
