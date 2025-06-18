// firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from './firebase.config';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  getDb() {
    return db;
  }
}
