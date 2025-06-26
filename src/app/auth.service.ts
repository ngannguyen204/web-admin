import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, from, throwError, of } from 'rxjs';
import { switchMap, map, take, tap, catchError } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { firebaseConfig } from './firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private readonly adminTokenKey = 'adminAuth';
  private readonly userTokenKey = 'userAuth';
  private readonly resetEmailKey = 'resetEmail';
  private readonly firebaseUserKey = 'firebaseUser';
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
  try {
    // Xóa toàn bộ session và token cũ TRƯỚC KHI đăng nhập
    await this.afAuth.signOut();
    localStorage.removeItem(this.adminTokenKey);
    localStorage.removeItem('firebaseUidToAdminId');
    
    const normalizedEmail = email.toLowerCase().trim();
    const userCredential = await this.afAuth.signInWithEmailAndPassword(normalizedEmail, password);
    
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const isAdmin = await this.checkAdminStatus(userCredential.user);
    
    if (!isAdmin) {
      await this.afAuth.signOut();
      localStorage.removeItem(this.adminTokenKey);
      throw new Error('Chỉ quản trị viên được phép đăng nhập');
    }
    
    return userCredential;
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    await this.afAuth.signOut();
    localStorage.removeItem(this.adminTokenKey);
    throw error;
  }
}

  public async cleanUpSession(): Promise<void> {
  try {
    // Sign out from Firebase
    await this.afAuth.signOut();
    
    // List of all auth-related keys to remove
    const authKeys = [
      this.adminTokenKey,
      this.userTokenKey,
      this.resetEmailKey,
      this.firebaseUserKey, // Add the firebaseUser key
      'rememberedUser',
      'accessToken',
      'authToken',
      'customer_id',
      'email',
      'resetToken',
      'user'
    ];
    
    // Remove all specified keys
    authKeys.forEach(key => localStorage.removeItem(key));
    
    // Remove any Firebase-specific keys (pattern matching)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('firebase:') || 
          key.startsWith('firebaseui::') ||
          key.includes('firebasehost') ||
          key.includes('firebaseUser')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error cleaning session:', error);
    throw error;
  }
}
private async checkAdminStatus(user: firebase.User | null): Promise<boolean> {
  if (!user || !user.email) {
    await this.cleanUpSession();
    return false;
  }

  try {
    const normalizedEmail = user.email.toLowerCase().trim();
    console.log(`Checking admin for UID: ${user.uid}`);

    // Kiểm tra token hiện tại
    const currentToken = this.getCurrentAdmin();
    if (currentToken?.uid === user.uid) {
      return true;
    }

    // Tìm admin bằng email
    const adminsRef = this.db.database.ref('admin');
    const query = adminsRef.orderByChild('email').equalTo(normalizedEmail);
    const snapshot = await query.once('value');

    if (!snapshot.exists()) {
      await this.cleanUpSession();
      return false;
    }

    let isAdmin = false;
    snapshot.forEach((childSnapshot) => {
      const adminData = childSnapshot.val();
      if (adminData?.adminid?.toString().toLowerCase().includes('admin')) {
        isAdmin = true;
        
        // Lưu token (không bao gồm mật khẩu)
        const { password, ...safeAdminData } = adminData;
        localStorage.setItem(this.adminTokenKey, JSON.stringify({
          uid: user.uid,
          email: normalizedEmail,
          ...safeAdminData
        }));

        // Thử cập nhật UID mapping
        this.db.database.ref(`firebaseUidToAdminId/${user.uid}`)
          .set(true)
          .catch(err => {
            console.warn("Không thể cập nhật UID mapping (có thể bỏ qua nếu đã tồn tại):", err);
          });
      }
      return !isAdmin;
    });

    return isAdmin;
  } catch (error) {
    console.error('Lỗi kiểm tra admin:', error);
    await this.cleanUpSession();
    throw error;
  }
}
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  isAdmin(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (!user || !user.email) return of(false);
        
        const adminData = this.getCurrentAdmin();
        if (!adminData) return of(false);
        
        // Kiểm tra xem email trong token có khớp với email đang đăng nhập không
        if (adminData.email !== user.email.toLowerCase().trim()) {
          this.cleanUpSession();
          return of(false);
        }

        return from(this.db.database.ref(`firebaseUidToAdminId/${user.uid}`).once('value')).pipe(
          map(snapshot => snapshot.val() === true),
          catchError(() => {
            this.cleanUpSession();
            return of(false);
          })
        );
      })
    );
  }


  async getUserId(uid: string): Promise<string | null> {
    try {
      const snapshot = await this.db.database.ref(`firebaseUidToUserId/${uid}`).once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error accessing firebaseUidToUserId:', error);
      return null;
    }
  }

  forgotPassword(email: string): Observable<void> {
    return from(this.afAuth.sendPasswordResetEmail(email)).pipe(
      tap(() => {
        localStorage.setItem(this.resetEmailKey, email);
      }),
      catchError(error => {
        const errorMap: { [key: string]: string } = {
          'auth/user-not-found': 'This email is not registered',
          'auth/invalid-email': 'Invalid email format',
          'auth/too-many-requests': 'Too many requests. Please try again later.'
        };

        return throwError(() => ({
          code: error.code,
          message: errorMap[error.code] || 'Error sending reset email'
        }));
      })
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return from(this.afAuth.fetchSignInMethodsForEmail(email)).pipe(
      map((methods: string[]) => methods.length > 0),
      catchError(error => {
        console.error('Error checking email:', error);
        return of(false);
      })
    );
  }

  confirmCode(email: string, code: string): Observable<boolean> {
    const validCode = '123456';
    return of(code === validCode);
  }

  getCurrentAdmin() {
    const adminData = localStorage.getItem(this.adminTokenKey);
    return adminData ? JSON.parse(adminData) : null;
  }

  async logout(): Promise<void> {
  try {
    await this.cleanUpSession(); 
    this.router.navigate(['/login']);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

  getCurrentUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  getAdminToken(): string | null {
    return localStorage.getItem(this.adminTokenKey);
  }
}