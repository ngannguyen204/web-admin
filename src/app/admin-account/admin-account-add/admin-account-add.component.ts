import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-account-add',
  standalone: false,
  templateUrl: './admin-account-add.component.html',
  styleUrls: ['./admin-account-add.component.css']
})
export class AdminAccountAddComponent {
  newAccount: any = {
    username: '',
    employeeId: '',
    email: '',
    phone: ''
  };

  errorMessage: string = ''; // ✅ Thêm biến để sửa lỗi
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(public router: Router) {}

  cancel() {
    this.router.navigate(['/admin-account']); 
  }

  save() {
    if (!this.newAccount.username || !this.newAccount.employeeId || !this.newAccount.email || !this.newAccount.phone) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      this.showPopupMessage(this.errorMessage);
      return;
    }

    console.log("Thêm mới:", this.newAccount);
    let adminList = JSON.parse(localStorage.getItem('adminList') || '[]');
    adminList.unshift(this.newAccount);
    localStorage.setItem('adminList', JSON.stringify(adminList));

    this.showPopupMessage('Thêm tài khoản thành công!', true);
  }

  showPopupMessage(message: string, redirect: boolean = false) {
    this.popupMessage = message;
    this.showPopup = true;

    if (redirect) {
      setTimeout(() => {
        this.showPopup = false;
        this.router.navigate(['/admin-account'], { state: { newAdmin: this.newAccount } });
      }, 2000);
    }
  }

  closePopup() {
    this.showPopup = false;
  }
}
