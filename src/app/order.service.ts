import { Injectable } from '@angular/core';
import {
  getDatabase,
  ref,
  onValue,
  update,
} from 'firebase/database';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private basePath = 'orders';
  private db: any;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    this.db = this.firebaseService.getDb();
  }

  // 🔄 Get all orders
  getAllOrders(): Observable<any[]> {
    return new Observable<any[]>(subscriber => {
      const ordersRef = ref(this.db, this.basePath);
      onValue(
        ordersRef,
        snapshot => {
          const data = snapshot.val();
          const orders: any[] = [];
          if (data) {
            Object.keys(data).forEach(key => {
              orders.push({ ...data[key], orderid: key });
            });
          }
          subscriber.next(orders);
        },
        error => subscriber.error(error)
      );
    });
  }

  // Update order status by orderid
  updateOrderStatus(orderid: string, status: string): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.authService.isAdmin().subscribe(isAdmin => {
        if (!isAdmin) {
          subscriber.error(new Error('Permission denied: Admin access required.'));
          return;
        }

        const orderRef = ref(this.db, `${this.basePath}/${orderid}`);
        update(orderRef, { status })
          .then(() => {
            subscriber.next();
            subscriber.complete();
          })
          .catch((error) => subscriber.error(error));
      });
    });
  }
}
