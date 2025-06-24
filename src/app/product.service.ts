import { Injectable } from '@angular/core';
import {
  getDatabase,
  ref,
  push,
  update,
  remove,
  onValue,
} from 'firebase/database';
import { Observable } from 'rxjs';
import { Product } from './class/product';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private basePath = 'products';
  private db: any;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    this.db = this.firebaseService.getDb();
  }

  getProducts(): Observable<Product[]> {
    return new Observable<Product[]>(subscriber => {
      const productsRef = ref(this.db, this.basePath);
      onValue(
        productsRef,
        snapshot => {
          const data = snapshot.val();
          const products: Product[] = [];
          if (data) {
            Object.keys(data).forEach(key => {
              products.push({ ...data[key], productid: key });
            });
          }
          subscriber.next(products);
        },
        error => subscriber.error(error)
      );
    });
  }

  getProductById(id: string): Observable<Product | null> {
    return new Observable<Product | null>(subscriber => {
      const productRef = ref(this.db, `${this.basePath}/${id}`);
      onValue(
        productRef,
        snapshot => {
          const product = snapshot.val();
          subscriber.next(product ? { ...product, productid: id } : null);
        },
        error => subscriber.error(error)
      );
    });
  }

  createProduct(product: Product): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.authService.isAdmin().subscribe(isAdmin => {
        if (!isAdmin) {
          subscriber.error(new Error('Permission denied: Admin access required.'));
          return;
        }

        const productsRef = ref(this.db, this.basePath);
        // Get all products to determine max id in '001', '002', ... format
        onValue(
          productsRef,
          snapshot => {
            const data = snapshot.val();
            let maxId = 0;
            if (data) {
              Object.keys(data).forEach(key => {
                const numId = parseInt(key, 10);
                if (!isNaN(numId) && numId > maxId) {
                  maxId = numId;
                }
              });
            }
            const newId = (maxId + 1).toString().padStart(3, '0');
            const newProductRef = ref(this.db, `${this.basePath}/${newId}`);
            update(newProductRef, product)
              .then(() => {
                subscriber.next();
                subscriber.complete();
              })
              .catch((error) => subscriber.error(error));
          },
          error => subscriber.error(error),
          { onlyOnce: true }
        );
      });
    });
  }

  updateProduct(productid: string, product: Product): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.authService.isAdmin().subscribe(isAdmin => {
        if (!isAdmin) {
          subscriber.error(new Error('Permission denied: Admin access required.'));
          return;
        }

        const productRef = ref(this.db, `${this.basePath}/${productid}`);
        update(productRef, product)
          .then(() => {
            subscriber.next();
            subscriber.complete();
          })
          .catch((error) => subscriber.error(error));
      });
    });
  }

  deleteProduct(productid: string): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.authService.isAdmin().subscribe(isAdmin => {
        if (!isAdmin) {
          subscriber.error(new Error('Permission denied: Admin access required.'));
          return;
        }

        const productRef = ref(this.db, `${this.basePath}/${productid}`);
        remove(productRef)
          .then(() => {
            subscriber.next();
            subscriber.complete();
          })
          .catch((error) => subscriber.error(error));
      });
    });
  }

  getProductsByCategory(categoryid: string): Observable<Product[]> {
    return new Observable<Product[]>(subscriber => {
      this.getProducts().subscribe({
        next: products => {
          const filtered = products.filter(p => p.categoryid === categoryid);
          subscriber.next(filtered);
        },
        error: err => subscriber.error(err)
      });
    });
  }

  getCategories(): Observable<{ [key: string]: string }> {
    const categoriesRef = ref(this.db, 'categories');
    return new Observable(subscriber => {
      onValue(
        categoriesRef,
        snapshot => {
          const data = snapshot.val();
          const categories: { [key: string]: string } = {};

          if (data) {
            Object.keys(data).forEach(key => {
              categories[key] = data[key].name;
            });
          }

          subscriber.next(categories);
        },
        error => subscriber.error(error)
      );
    });
  }
}
