import { Injectable } from '@angular/core';
import {
  getDatabase,
  ref,
  set,
  update,
  remove,
  onValue,
  get
} from 'firebase/database';
import { Observable } from 'rxjs';
import { Promotion } from './class/promotion';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private db: any;
  private basePath = 'promotions';

  constructor(private firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDb();
  }

  // Get all promotions
  getAllPromotions(): Observable<Promotion[]> {
    return new Observable<Promotion[]>(subscriber => {
      const promoRef = ref(this.db, this.basePath);
      onValue(
        promoRef,
        snapshot => {
          const data = snapshot.val();
          const promotions: Promotion[] = [];
          if (data) {
            Object.keys(data).forEach(key => {
              promotions.push({ ...data[key], promotionid: key });
            });
          }
          subscriber.next(promotions);
        },
        error => subscriber.error(error)
      );
    });
  }

  // Get promotion by ID
  getPromotionById(id: string): Observable<Promotion | null> {
    return new Observable<Promotion | null>(subscriber => {
      const promoRef = ref(this.db, `${this.basePath}/${id}`);
      onValue(
        promoRef,
        snapshot => {
          const promo = snapshot.val();
          subscriber.next(promo ? { ...promo, promotionid: id } : null);
        },
        error => subscriber.error(error)
      );
    });
  }

  // Create promotion (ID already exists)
  createPromotion(promotion: Promotion): Observable<void> {
    return new Observable<void>(subscriber => {
      const promoRef = ref(this.db, `${this.basePath}/${promotion.promotionid}`);
      set(promoRef, promotion)
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch(error => subscriber.error(error));
    });
  }

  // Update existing promotion
  updatePromotion(id: string, promotion: Promotion): Observable<void> {
    return new Observable<void>(subscriber => {
      const promoRef = ref(this.db, `${this.basePath}/${id}`);
      update(promoRef, promotion)
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch(error => subscriber.error(error));
    });
  }

  // Delete promotion
  deletePromotion(id: string): Observable<void> {
    return new Observable<void>(subscriber => {
      const promoRef = ref(this.db, `${this.basePath}/${id}`);
      remove(promoRef)
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch(error => subscriber.error(error));
    });
  }
}
