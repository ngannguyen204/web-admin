import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { forkJoin, Observable, from, of } from 'rxjs';
import { switchMap, map, catchError, take, tap } from 'rxjs/operators';
import { firebaseConfig } from './firebase.config';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminTokenKey = 'adminToken';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private http: HttpClient
  ) {
    this.afAuth.onAuthStateChanged(user => {
      console.log('Firebase auth state changed:', user);
    });

    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }

  isAdmin(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((user: firebase.User | null) => {
        if (!user) return of(false);
        return from(user.getIdTokenResult()).pipe(
          map((token: firebase.auth.IdTokenResult) => !!token.claims['admin'])
        );
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
  return from(this.afAuth.sendPasswordResetEmail(email)).pipe(
    tap(() => {
  console.log('Password reset email sent to:', email);
      localStorage.setItem('resetEmail', email);
    }),
    catchError(error => {
    
      const errorMap: {[key: string]: string} = {
        'auth/user-not-found': 'This email is not registered',
        'auth/invalid-email': 'Invalid email format',
        'auth/too-many-requests': 'Too many requests. Please try again later.'
      };
      
      throw {
        code: error.code,
        message: errorMap[error.code] || 'Error sending reset email'
      };
    })
  );
}
  checkEmailExists(email: string): Observable<boolean> {
    console.log('Checking email in Firebase ', email);
    return from(this.afAuth.fetchSignInMethodsForEmail(email)).pipe(
      tap(methods => console.log('Login method:', methods)),
      map(methods => methods.length > 0),
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

 

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem(this.adminTokenKey);
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