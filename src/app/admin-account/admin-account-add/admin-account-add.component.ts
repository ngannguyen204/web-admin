import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAccountService } from '../../admin-account.service';

@Component({
  selector: 'app-admin-account-add',
  standalone: false,
  templateUrl: './admin-account-add.component.html',
  styleUrls: ['./admin-account-add.component.css']
})
export class AdminAccountAddComponent {
  newAccount: any = {
    username: '',
    email: '',
    password:''
  };

  errorMessage: string = ''; 
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(public router: Router,
    private adminAccountService: AdminAccountService
  ) {}

  cancel() {
    this.router.navigate(['/admin-account']); 
  }

  save() {
    if (!this.newAccount.username  || !this.newAccount.email || !this.newAccount.password) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      this.showPopupMessage(this.errorMessage);
      return;
    }

   // Gọi API để thêm Admin mới
   this.adminAccountService.createAdmin(this.newAccount).subscribe(
    (response: any) => {
      console.log('Admin created:', response);
      this.showPopupMessage('Thêm tài khoản thành công!', true);
    },
    (error) => {
      console.error('Error creating admin:', error);
      // Log thông báo lỗi chi tiết từ server
      if (error.error && error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Lỗi khi thêm tài khoản. Vui lòng thử lại!';
      }
      this.showPopupMessage(this.errorMessage);
    }
  );
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
