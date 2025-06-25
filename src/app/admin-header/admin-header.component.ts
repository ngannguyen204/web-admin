import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  username: string = 'Admin';
  role: string = 'Admin';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Get admin info from localStorage (stored by AuthService)
    const adminData = localStorage.getItem('adminAuth');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        this.username = admin.name || admin.username || admin.email || 'Admin';
        this.role = 'Admin'; // Since this is admin header, role is always Admin
      } catch (e) {
        console.error('Error parsing admin data:', e);
      }
    }
  }

  logout() {
    // Use AuthService's logout method which properly handles cleanup
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Logout error:', error);
      this.router.navigate(['/login']);
    });
  }
}