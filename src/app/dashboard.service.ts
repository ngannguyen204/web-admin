import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { ref, get, query, orderByChild, startAt, endAt } from 'firebase/database';
import { Observable, from, of } from 'rxjs';
import { map, catchError, take, switchMap } from 'rxjs/operators';
import { Order } from './class/order';
import { AuthService } from './auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(
  private firebaseService: FirebaseService, 
  private authService: AuthService
) {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Firebase user UID:', user.uid); // đã đăng nhập thật
    } else {
      console.log('User not signed in'); // chưa đăng nhập
    }
  });
}

  // Thống kê cả năm - chỉ cần authenticated
 getYearlyStats(year: number): Observable<any> {
  return this.authService.isAuthenticated().pipe(
    switchMap(isAuth => {
      if (!isAuth) {
        console.warn('Access denied - Only for authenticated users');
        return of(this.createEmptyStatsResponse());
      }

      const db = this.firebaseService.getDb();
      if (!db) {
        console.error('Firebase database not available');
        return of(this.createEmptyStatsResponse());
      }

      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      const ordersRef = query(
        ref(db, 'orders'), 
        orderByChild('orderdate'), 
        startAt(startDate), 
        endAt(endDate + '\uf8ff')
      );

      return from(get(ordersRef)).pipe(
        map(snapshot => {
          let visits = 0, orders = 0, revenue = 0;
          const monthlyData: {[key: string]: {orders: number, revenue: number}} = {};

          if (snapshot.exists()) {
            snapshot.forEach(child => {
              const order = child.val() as Order;
              const orderDate = order.orderdate?.split('T')[0] || '';
              const month = orderDate.split('-')[1];

              visits++;
              orders++;
              revenue += order.totalamount || 0;

              if (month) {
                if (!monthlyData[month]) {
                  monthlyData[month] = { orders: 0, revenue: 0 };
                }
                monthlyData[month].orders++;
                monthlyData[month].revenue += order.totalamount || 0;
              }
            });
          }

          return {
            visits,
            orders,
            revenue,
            monthlyData: this.formatMonthlyData(monthlyData)
          };
        }),
        catchError(error => {
          console.error('Error fetching yearly stats:', error);
          return of(this.createEmptyStatsResponse());
        })
      );
    })
  );
}


  // Bán hàng theo tháng
  getMonthlySalesData(month: number, year: number): Observable<any[]> {
    return this.authService.isAuthenticated().pipe(
      switchMap(isAuth => {
        if (!isAuth) {
          return of([]);
        }

        const db = this.firebaseService.getDb();
        if (!db) {
          return of([]);
        }

        const start = `${year}-${month.toString().padStart(2, '0')}-01`;
        const end = `${year}-${month.toString().padStart(2, '0')}-31`;

        const ordersRef = query(
          ref(db, 'orders'), 
          orderByChild('orderdate'), 
          startAt(start), 
          endAt(end + '\uf8ff')
        );

        return from(get(ordersRef)).pipe(
          map(snapshot => {
            const dailyData: {[key: string]: number} = {};

            if (snapshot.exists()) {
              snapshot.forEach(child => {
                const order = child.val() as Order;
                const date = order.orderdate?.split('T')[0] || '';
                if (date) {
                  dailyData[date] = (dailyData[date] || 0) + (order.totalamount || 0);
                }
              });
            }

            return Object.keys(dailyData).map(date => ({
              day: new Date(date).getDate(),
              date,
              revenue: dailyData[date]
            })).sort((a, b) => a.day - b.day);
          }),
          catchError(err => {
            console.error('Error fetching monthly sales:', err);
            return of([]);
          })
        );
      })
    );
  }

 getTopSellingProducts(): Observable<any[]> {
  return this.authService.isAuthenticated().pipe(
    switchMap(isAuth => {
      if (!isAuth) return of([]);

      const db = this.firebaseService.getDb();
      if (!db) return of([]);

      // Lấy cả orders và products
      return from(Promise.all([
        get(ref(db, 'orders')),
        get(ref(db, 'products'))
      ])).pipe(
        map(([ordersSnap, productsSnap]) => {
          const productMap: {
            [key: string]: { 
              product_id: string, 
              product_name: string, 
              total_sold: number 
            }
          } = {};

          // Tạo map từ products để tra cứu nhanh tên sản phẩm
          const productsData = productsSnap.exists() ? productsSnap.val() : {};

          if (ordersSnap.exists()) {
            ordersSnap.forEach(child => {
              const order = child.val() as Order;
              if (order.products && Array.isArray(order.products)) {
                order.products.forEach((p: any) => {
                  const pid = p.productid;
                  if (!productMap[pid]) {
                    // Lấy tên sản phẩm từ productsData hoặc mặc định
                    const productName = productsData[pid]?.name || '(Unknown Product)';
                    productMap[pid] = {
                      product_id: pid,
                      product_name: productName,
                      total_sold: 0
                    };
                  }
                  productMap[pid].total_sold += p.quantity || 0;
                });
              }
            });
          }

          // Chuyển thành mảng và sắp xếp
          return Object.values(productMap)
            .sort((a, b) => b.total_sold - a.total_sold)
            .slice(0, 5)
            .map((item, idx) => ({ 
              ...item, 
              _id: idx + 1  // Thêm số thứ tự
            }));
        }),
        catchError(err => {
          console.error('Error loading top products:', err);
          return of([]);
        })
      );
    })
  );
}

  private createEmptyStatsResponse() {
    return {
      visits: 0,
      orders: 0,
      revenue: 0,
      monthlyData: this.createEmptyMonthlyData()
    };
  }

  private createEmptyMonthlyData(): {[key: string]: {orders: number, revenue: number}} {
    const data: {[key: string]: {orders: number, revenue: number}} = {};
    for (let i = 1; i <= 12; i++) {
      data[i.toString().padStart(2, '0')] = { orders: 0, revenue: 0 };
    }
    return data;
  }

  private formatMonthlyData(raw: {[key: string]: {orders: number, revenue: number}}): any[] {
    return this.monthNames.map((name, i) => {
      const key = (i + 1).toString().padStart(2, '0');
      return {
        month: name,
        orders: raw[key]?.orders || 0,
        revenue: raw[key]?.revenue || 0
      };
    });
  }
}