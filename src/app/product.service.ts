import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './class/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private basePath = 'products';

constructor(private db: AngularFireDatabase) {
  console.log('✅ AngularFireDatabase is', this.db);
}

  getProducts(): Observable<Product[]> {
    console.log('📦 [ProductService] getProducts called');

    return this.db
      .list<Product>(this.basePath)
      .snapshotChanges()
      .pipe(
        map(actions => {
          const result = actions.map(a => {
            const data = a.payload.val() as Product;
            const key = a.key ?? '';
            const merged: Product = { ...data, productid: key };
            return merged;
          });

          console.log('✅ [ProductService] Loaded products:', result);
          return result;
        })
      );
  }

  getProductById(id: string): Observable<Product | null> {
    return this.db
      .object<Product>(`${this.basePath}/${id}`)
      .valueChanges()
      .pipe(
        map(product => {
          if (product) {
            const result: Product = { ...product, productid: id };
            console.log('🔍 [ProductService] Fetched product by ID:', result);
            return result;
          }
          return null;
        })
      );
  }

  createProduct(product: Product): Observable<void> {
    const productsRef = this.db.list(this.basePath);
    return from(productsRef.push(product)).pipe(map(() => {
      console.log('🆕 [ProductService] Product created:', product);
    }));
  }

  updateProduct(productid: string, product: Product): Observable<void> {
    return from(
      this.db.object(`${this.basePath}/${productid}`).update(product)
    ).pipe(map(() => {
      console.log('✏️ [ProductService] Product updated:', productid, product);
    }));
  }

  deleteProduct(productid: string): Observable<void> {
    return from(
      this.db.object(`${this.basePath}/${productid}`).remove()
    ).pipe(map(() => {
      console.log('🗑️ [ProductService] Product deleted:', productid);
    }));
  }

  getProductsByCategory(categoryid: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        const filtered = products.filter(p => p.categoryid === categoryid);
        console.log(`📂 [ProductService] Products in category ${categoryid}:`, filtered);
        return filtered;
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.db
      .list<string>('categories')
      .valueChanges()
      .pipe(map(categories => {
        console.log('📋 [ProductService] Categories:', categories);
        return categories || [];
      }));
  }
}
