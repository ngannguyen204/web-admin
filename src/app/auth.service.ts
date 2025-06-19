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
  private adminTokenKey = 'adminAuth';
  private userTokenKey = 'userAuth';

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
    const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
    const isAdmin = await this.checkAdminStatus(userCredential.user);
    
    if (!isAdmin) {
      await this.afAuth.signOut();
      throw new Error('Only admin users are allowed to login');
    }
    
    return userCredential;
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}
private async checkAdminStatus(user: firebase.User | null): Promise<boolean> {
  if (!user || !user.email) return false;

  try {
    console.log('Checking admin status for:', user.email);
    const adminsRef = this.db.database.ref('admin');
    const query = adminsRef.orderByChild('email').equalTo(user.email);
    const adminsSnapshot = await query.once('value');

    if (adminsSnapshot.exists()) {
      const adminKey = Object.keys(adminsSnapshot.val())[0];
      const adminData = adminsSnapshot.val()[adminKey];

      if (adminData.adminid && adminData.adminid.includes('admin')) {
        // Thay vì lưu adminKey, chỉ lưu giá trị true
        try {
          await this.db.database.ref(`firebaseUidToAdminId/${user.uid}`).set(true);
          console.log('Admin mapping created with true value');
        } catch (writeError) {
          console.warn('Could not create mapping:', writeError);
        }

        // Lưu thông tin admin (loại bỏ password)
        const { password, ...adminInfo } = adminData;
        localStorage.setItem(this.adminTokenKey, JSON.stringify({
          uid: user.uid,
          ...adminInfo
        }));
        
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw error;
  }
}
  isAdmin(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (!user) return of(false);
        
        // Kiểm tra trong localStorage trước
        const adminData = localStorage.getItem(this.adminTokenKey);
        if (adminData) {
          try {
            const parsedData = JSON.parse(adminData);
            return of(parsedData.adminid && parsedData.adminid.includes('admin'));
          } catch {
            return of(false);
          }
        }
        
        // Nếu không có trong localStorage, kiểm tra trong database
        return from(this.db.database.ref('admin').orderByChild('email').equalTo(user.email).once('value')).pipe(
          map(snapshot => {
            if (snapshot.exists()) {
              const adminData = Object.values(snapshot.val())[0] as any;
              return adminData && adminData.adminid && adminData.adminid.includes('admin');
            }
            return false;
          }),
          catchError(() => of(false))
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
      console.log('Password reset email sent to:', email);
      localStorage.setItem('resetEmail', email);
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
  console.log('Checking email in Firebase ', email);
  return from(this.afAuth.fetchSignInMethodsForEmail(email)).pipe(
    tap((methods: string[]) => console.log('Login method:', methods)),
    map((methods: string[]) => methods.length > 0),
    catchError(error => {
      console.error('Error Firebase while checking email:', error);
      return of(false);
    })
  );
}


 confirmCode(email: string, code: string): Observable<boolean> {
  // Hardcoded verification code 
  const validCode = '123456';
  return of(code === validCode);
}

 

  getCurrentAdmin() {
    const adminData = localStorage.getItem(this.adminTokenKey);
    return adminData ? JSON.parse(adminData) : null;
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem(this.adminTokenKey);
      localStorage.removeItem(this.userTokenKey);
      this.router.navigate(['/login']);
    } catch (error) {
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