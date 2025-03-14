import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  orders: any[] = []; // Danh sách đơn hàng
  filteredOrders: any[] = []; // Danh sách đơn hàng sau lọc

  allStatuses: string[] = ['Chờ xác nhận', 'Chờ lấy hàng', 'Chờ giao hàng', 'Đã giao', 'Đã hủy'];
  selectedStatuses: string[] = [];
  showFilterPopup: boolean = false;

  // Phân trang
  currentPage: number = 1;
  itemsPerPage: number = 5; // ✅ Hiển thị 3 đơn hàng mỗi trang
  totalPages: number = 1;

  constructor() {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orders = [
      { id: '001', name: 'Nguyễn Văn A', address: 'Hà Nội', date: '2025-03-09', payment: 'COD', status: 'Chờ xác nhận' },
      { id: '002', name: 'Trần Thị B', address: 'TP.HCM', date: '2025-03-08', payment: 'VISA', status: 'Chờ lấy hàng' },
      { id: '003', name: 'Lê Văn C', address: 'Đà Nẵng', date: '2025-03-07', payment: 'QR CODE', status: 'Chờ giao hàng' },
      { id: '004', name: 'Phạm Thị D', address: 'Hải Phòng', date: '2025-03-06', payment: 'COD', status: 'Đã giao' },
      { id: '005', name: 'Bùi Quang E', address: 'Cần Thơ', date: '2025-03-05', payment: 'VISA', status: 'Đã hủy' },
      { id: '006', name: 'Hoàng Văn F', address: 'Bắc Ninh', date: '2025-03-04', payment: 'MOMO', status: 'Chờ xác nhận' },
      { id: '007', name: 'Đinh Thị G', address: 'Huế', date: '2025-03-03', payment: 'VISA', status: 'Đã giao' }
    ];
    this.applyFilter(); // ✅ Áp dụng filter và cập nhật phân trang
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
      this.filteredOrders = this.orders.filter(order => this.selectedStatuses.includes(order.status));
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

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Chờ xác nhận': 'pending',
      'Chờ lấy hàng': 'shipping',
      'Chờ giao hàng': 'processing',
      'Đã giao': 'delivered',
      'Đã hủy': 'canceled'
    };
    return statusClasses[status] || '';
  }

  // ✅ Phân trang
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  get paginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
