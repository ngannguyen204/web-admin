import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { forkJoin, Observable, from, of } from 'rxjs';
import { switchMap, map, catchError, take } from 'rxjs/operators';
import { firebaseConfig } from './firebase.config';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminTokenKey = 'adminToken';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,   
  private db: AngularFireDatabase,
 
  ) {
    // Initialize Firebase if not already initialized
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
    return from(this.afAuth.sendPasswordResetEmail(email));
  }

 //checkEmailExists(email: string): Observable<boolean> {
  //return from(this.afAuth.fetchSignInMethodsForEmail(email)).pipe(
    //map(signInMethods => signInMethods.length > 0),
    //catchError(() => of(false))
  //);
//}
checkEmailExists(email: string): Observable<boolean> {
  return of(true);
}

confirmCode(email: string, code: string): Observable<boolean> {
  // Hardcoded verification code
  const validCode = '123456';
  if (code === validCode) {
    // Generate a reset token (in a real app, use Firebase's reset token)
    const resetToken = Math.random().toString(36).substring(2);
    localStorage.setItem('resetToken', resetToken);
    return of(true);
  }
  return of(false);
}

resetPassword(resetToken: string, newPassword: string): Observable<any> {
  // Update in Firebase Auth
  const authUpdate = from(this.afAuth.confirmPasswordReset(resetToken, newPassword));
  
  // Update in Realtime Database
  const email = localStorage.getItem('email') || '';
  const dbUpdate = this.db.list('admin', ref => 
    ref.orderByChild('email').equalTo(email)
  ).snapshotChanges().pipe(
    take(1),
    switchMap(snapshots => {
      const updates = snapshots.map(snapshot => {
        const key = snapshot.key;
        return this.db.object(`admin/${key}/password`).set(newPassword);
      });
      return forkJoin(updates);
    })
  );

  return forkJoin([authUpdate, dbUpdate]);
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