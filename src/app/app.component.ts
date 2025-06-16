import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';

  constructor(public router: Router) {}

  // Kiểm tra nếu đang ở trang login thì ẩn header & slide-bar
  isLoginPage(): boolean {
    const hiddenPages = ['/login', '/forgot-password', '/reset-password', '/confirm-code'];
    return hiddenPages.includes(this.router.url);
  }
  
}
