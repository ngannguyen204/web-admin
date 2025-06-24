import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue, update, remove, push } from 'firebase/database';
import { Observable } from 'rxjs';
import { Admin } from './class/admin';
import { Customer } from './class/customer';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAccountService {
  private db: any;
  private adminPath = 'admin';
  private userPath = 'users';

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    this.db = this.firebaseService.getDb();
  }

  //  Get all admins
  getAdmins(): Observable<Admin[]> {
    return new Observable(subscriber => {
      const refPath = ref(this.db, this.adminPath);
      onValue(refPath, snapshot => {
        const data = snapshot.val();
        const result: Admin[] = [];

        if (data) {
          Object.keys(data).forEach(key => {
            result.push({ ...data[key], adminid: key });
          });
        }

        subscriber.next(result);
      }, error => subscriber.error(error));
    });
  }

  //  Get admin by ID
  getAdminById(id: string): Observable<Admin | null> {
    return new Observable(subscriber => {
      const adminRef = ref(this.db, `${this.adminPath}/${id}`);
      onValue(adminRef, snapshot => {
        const data = snapshot.val();
        subscriber.next(data ? { ...data, adminid: id } : null);
      }, error => subscriber.error(error));
    });
  }

  //  Create new admin with auto-incremented id (admin001, admin002, ...)
  createAdmin(admin: Admin): Observable<void> {
    return new Observable(subscriber => {
      const refPath = ref(this.db, this.adminPath);
      onValue(refPath, snapshot => {
        const data = snapshot.val();
        let maxId = 0;

        if (data) {
          Object.keys(data).forEach(key => {
            const match = key.match(/^admin(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxId) maxId = num;
            }
          });
        }

        const newIdNum = maxId + 1;
        const newId = `admin${newIdNum.toString().padStart(3, '0')}`;
        const adminRef = ref(this.db, `${this.adminPath}/${newId}`);

        update(adminRef, admin)
          .then(() => {
            subscriber.next();
            subscriber.complete();
          })
          .catch(err => subscriber.error(err));
      }, err => subscriber.error(err), { onlyOnce: true });
    });
  }

  //  Update admin
  updateAdmin(id: string, admin: Admin): Observable<void> {
    return new Observable(subscriber => {
      const adminRef = ref(this.db, `${this.adminPath}/${id}`);
      update(adminRef, admin)
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }

  //  Delete admin
  deleteAdmin(id: string): Observable<void> {
    return new Observable(subscriber => {
      const adminRef = ref(this.db, `${this.adminPath}/${id}`);
      remove(adminRef)
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }

  //  Get all customers (users)
  getCustomers(): Observable<Customer[]> {
    return new Observable(subscriber => {
      const userRef = ref(this.db, this.userPath);
      onValue(userRef, snapshot => {
        const data = snapshot.val();
        const customers: Customer[] = [];

        if (data) {
          Object.keys(data).forEach(key => {
            customers.push({ ...data[key], userid: key });
          });
        }

        subscriber.next(customers);
      }, err => subscriber.error(err));
    });
  }

  //  Get customer by ID
  getCustomerById(id: string): Observable<Customer | null> {
    return new Observable(subscriber => {
      const userRef = ref(this.db, `${this.userPath}/${id}`);
      onValue(userRef, snapshot => {
        const data = snapshot.val();
        subscriber.next(data ? { ...data, userid: id } : null);
      }, err => subscriber.error(err));
    });
  }

  //  Update customer
  updateCustomer(id: string, customer: Customer): Observable<void> {
    return new Observable(subscriber => {
      const userRef = ref(this.db, `${this.userPath}/${id}`);
      update(userRef, customer)
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }
}
