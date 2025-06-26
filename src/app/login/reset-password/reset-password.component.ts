import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email = localStorage.getItem('resetEmail') || '';
  newPassword: string = '';
  confirmPassword: string = '';
  rememberMe: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  passwordFieldType: string = 'password';
  oobCode: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.parseResetPasswordUrl();
    console.log('Initialized with:', {
      email: this.email,
      oobCode: this.oobCode
    });
  }

  private parseResetPasswordUrl() {
    try {
      // Handle Firebase hosted URL redirect first
      if (window.location.href.includes('mode=resetPassword')) {
        const url = new URL(window.location.href);
        this.oobCode = url.searchParams.get('oobCode') || '';
        this.email = url.searchParams.get('email') || this.email;
        
        // Redirect to our reset page with the parameters
        if (this.oobCode) {
          this.router.navigate(['/reset-password'], {
            queryParams: { 
              oobCode: this.oobCode,
              email: this.email
            },
            replaceUrl: true // Replace history to prevent loop
          });
          return;
        }
      }

      // Handle direct access to our reset page
      const url = new URL(window.location.href);
      this.oobCode = url.searchParams.get('oobCode') || '';
      this.email = url.searchParams.get('email') || this.email;

      // Handle hash parameters (some Firebase redirects use hash)
      if (!this.oobCode && window.location.hash.includes('oobCode')) {
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
        this.oobCode = hashParams.get('oobCode') || '';
        this.email = hashParams.get('email') || this.email;
      }

      // Validate we have required parameters
      if (!this.oobCode) {
        this.showPopupMessage('Link đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu link mới.');
        return;
      }

      // Store values for later use
      localStorage.setItem('resetCode', this.oobCode);
      if (this.email) {
        localStorage.setItem('resetEmail', this.email);
      }

    } catch (error) {
      console.error('Error parsing reset password URL:', error);
      this.showPopupMessage('Có lỗi xảy ra khi xử lý link đặt lại mật khẩu.');
    }
  }

  async onResetPassword() {
    this.isLoading = true;
    try {
      // Validate inputs first
      if (!this.newPassword || !this.confirmPassword) {
        throw new Error('Vui lòng điền đầy đủ thông tin!');
      }

      if (this.newPassword.length < 6) {
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
      }

      if (this.newPassword !== this.confirmPassword) {
        throw new Error('Mật khẩu không khớp!');
      }

      // Get the oobCode from URL or localStorage
      const oobCodeToUse = this.oobCode || localStorage.getItem('resetCode');
      if (!oobCodeToUse) {
        throw new Error('Không tìm thấy mã xác nhận. Vui lòng sử dụng link từ email.');
      }

      // Verify and reset password using Firebase auth directly
      const auth = getAuth();
      
      try {
        // First verify the password reset code
        console.log('Verifying reset code:', oobCodeToUse);
        const verifiedEmail = await verifyPasswordResetCode(auth, oobCodeToUse);
        console.log('Verified email:', verifiedEmail);
        
        // Update email if it wasn't set
        if (!this.email && verifiedEmail) {
          this.email = verifiedEmail;
          localStorage.setItem('resetEmail', this.email);
        }

        // Then confirm the password reset
        console.log('Attempting password reset for:', this.email);
        await confirmPasswordReset(auth, oobCodeToUse, this.newPassword);
        console.log('Password reset confirmed in Firebase Auth');

        // Verify the new password works by signing in
        try {
          console.log('Verifying new password by signing in...');
          await signInWithEmailAndPassword(auth, this.email, this.newPassword);
          console.log('Successfully signed in with new password');
          
          // Sign out immediately after verification
          await auth.signOut();
        } catch (signInError) {
          console.error('Failed to verify new password:', signInError);
          throw new Error('Xác minh mật khẩu mới thất bại. Vui lòng thử lại.');
        }

        // Update database if needed (for admin users)
        await this.updateAdminPasswordInDatabase();

        // Show success message and redirect
        this.showPopupMessage('Đổi mật khẩu thành công! Đang chuyển hướng...');
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetCode');
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);

      } catch (firebaseError: any) {
        console.error('Firebase password reset error:', firebaseError);
        throw firebaseError;
      }

    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage = this.getFriendlyErrorMessage(error);
      this.showPopupMessage(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  private getFriendlyErrorMessage(error: any): string {
    const errorMap: {[key: string]: string} = {
      'auth/invalid-action-code': 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.',
      'auth/expired-action-code': 'Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.',
      'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
      'auth/user-not-found': 'Không tìm thấy tài khoản',
      'auth/weak-password': 'Mật khẩu quá yếu (ít nhất 6 ký tự)',
      'auth/wrong-password': 'Mật khẩu không đúng',
      'auth/too-many-requests': 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
    };
    
    return errorMap[error.code] || error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!';
  }

  private async updateAdminPasswordInDatabase() {
    if (!this.email) {
      console.warn('No email available for database update');
      return;
    }

    try {
      console.log('Searching for admin with email:', this.email);
      const adminsRef = this.db.database.ref('admin');
      const query = adminsRef.orderByChild('email').equalTo(this.email.toLowerCase());
      const snapshot = await query.once('value');

      if (!snapshot.exists()) {
        console.warn('Admin not found in database with email:', this.email);
        return;
      }

      const adminData = snapshot.val();
      const adminKey = Object.keys(adminData)[0];
      console.log('Found admin record with key:', adminKey);

      const updates = {
        password: this.newPassword,
        lastPasswordUpdate: firebase.database.ServerValue.TIMESTAMP
      };

      console.log('Updating admin with data:', updates);
      await this.db.database.ref(`admin/${adminKey}`).update(updates);
      console.log('Database update successful');

    } catch (dbError) {
      console.error('Failed to update admin password in database:', dbError);
      throw new Error('Cập nhật cơ sở dữ liệu thất bại. Liên hệ quản trị viên.');
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