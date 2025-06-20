import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { getDatabase, ref, onValue } from 'firebase/database';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];

  allStatuses: string[] = ['Pending', 'Shipping', 'Delivered'];
  selectedStatuses: string[] = [];
  showFilterPopup: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Customer name map from Firebase
  customers: { [userid: string]: string } = {};

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchCustomers();
    this.fetchOrders();
  }

  fetchCustomers() {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      this.customers = {};
      if (data) {
        Object.keys(data).forEach(userid => {
          this.customers[userid] = data[userid].name || 'Unnamed';
        });
      }
    }, (error) => {
      console.error('Failed to fetch customer data:', error);
    });
  }

  getCustomerName(userid: string): string {
    return this.customers[userid] || 'Unknown User';
  }

  fetchOrders() {
    this.orderService.getAllOrders().subscribe(
      (data: any[]) => {
        console.log('Orders:', data);
        this.orders = data;
        this.applyFilter();
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  orderStatuses = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Shipping', label: 'Shipping' },
    { value: 'Delivered', label: 'Delivered' }
  ];

  getAllowedStatuses(currentStatus: string): { value: string, label: string }[] {
    let allowed: string[] = [];

    if (currentStatus === 'Pending') {
      allowed = ['Shipping', 'Delivered'];
    } else if (currentStatus === 'Shipping') {
      allowed = ['Delivered'];
    } else if (currentStatus === 'Delivered') {
      allowed = ['Delivered'];
    }

    if (!allowed.includes(currentStatus)) {
      allowed.unshift(currentStatus);
    }

    return this.orderStatuses.filter(status => allowed.includes(status.value));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Shipping': return 'shipping';
      case 'Delivered': return 'delivered';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    const map: { [key: string]: string } = {
      'Pending': 'Pending',
      'Shipping': 'Shipping',
      'Delivered': 'Delivered'
    };
    return map[status] || 'Unknown';
  }

  updateOrderStatus(order: any) {
    const newStatus = order.status;
    const allowedStatuses = this.getAllowedStatuses(order.status);

    if (allowedStatuses.some(status => status.value === newStatus)) {
      this.orderService.updateOrderStatus(order.orderid, newStatus).subscribe(
        () => {
          console.log('Status updated');
          this.fetchOrders();
        },
        error => {
          console.error('Error updating status:', error);
        }
      );
    } else {
      console.error('Invalid status transition');
      alert('Invalid status selected.');
    }
  }

  toggleFilterPopup() {
    this.showFilterPopup = !this.showFilterPopup;
  }

  toggleStatus(status: string) {
    if (this.selectedStatuses.includes(status)) {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    } else {
      this.selectedStatuses.push(status);
    }
  }

  applyFilter() {
    if (this.selectedStatuses.length === 0) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order =>
        this.selectedStatuses.includes(order.status)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
    this.showFilterPopup = false;
  }

  clearFilters() {
    this.selectedStatuses = [];
    this.filteredOrders = [...this.orders];
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }
}
