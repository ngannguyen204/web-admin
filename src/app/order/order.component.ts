import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
@Component({
  selector: 'app-order',
  standalone:false,
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
  itemsPerPage: number = 10; // Hiển thị 5 đơn hàng mỗi trang
  totalPages: number = 1;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    const token = localStorage.getItem('authToken');
    console.log('Token từ localStorage:', token);
    if (!token) {
      console.error('Token không tồn tại, vui lòng đăng nhập lại.');
      return;
    }
  
    this.orderService.getAllOrders().subscribe(
      (data: any[]) => {
        console.log('Dữ liệu đơn hàng từ backend:', data); 
        this.orders = data;
        this.applyFilter(); // Áp dụng filter và cập nhật phân trang
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
      }
    );
  }
  
  getAllowedStatuses(currentStatus: string): { value: string, label: string }[] {
    let allowedStatuses: string[] = [];
  
    if (currentStatus === 'Chờ xác nhận') {
      allowedStatuses = ['Chờ lấy hàng', 'Chờ giao hàng', 'Đã giao', 'Đã hủy'];
    } else if (currentStatus === 'Chờ giao hàng') {
      allowedStatuses = ['Chờ lấy hàng', 'Đã giao', 'Đã hủy'];
    } else if (currentStatus === 'Chờ lấy hàng') {
      allowedStatuses = ['Đã giao', 'Đã hủy'];
    } else if (currentStatus === 'Đã giao' || currentStatus === 'Đã hủy') {
      allowedStatuses = [currentStatus]; // Chỉ hiển thị chính nó
    }
  
    // Đảm bảo trạng thái hiện tại luôn hiển thị để tránh mất trạng thái
    if (!allowedStatuses.includes(currentStatus)) {
      allowedStatuses.unshift(currentStatus);
    }
  
    return this.orderStatuses.filter(status => allowedStatuses.includes(status.value));
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
      this.filteredOrders = this.orders.filter(order => this.selectedStatuses.includes(order.order_status));
    }
    console.log('Filtered Orders:', this.filteredOrders); // Kiểm tra dữ liệu sau khi lọc
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

  orderStatuses = [
    { value: 'Chờ xác nhận', label: 'Chờ xác nhận' },
    { value: 'Chờ lấy hàng', label: 'Chờ lấy hàng' },
    { value: 'Chờ giao hàng', label: 'Chờ giao hàng' },
    { value: 'Đã giao', label: 'Đã giao' },
    { value: 'Đã hủy', label: 'Đã hủy' }
  ];

  getStatusClass(order_status: string): string {
    switch (order_status) {
      case 'Chờ xác nhận': return 'pending';
      case 'Chờ lấy hàng': return 'processing';
      case 'Chờ giao hàng': return 'shipping';
      case 'Đã giao': return 'delivered';
      case 'Đã hủy': return 'cancelled';
      default: return '';
    }
  }
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Chờ xác nhận': 'Chờ xác nhận',
      'Chờ lấy hàng': 'Chờ lấy hàng',
      'Chờ giao hàng': 'Chờ giao hàng',
      'Đã giao': 'Đã giao',
      'Đã hủy': 'Đã hủy'
    };
    return statusMap[status] || 'Unknown';
  }

  updateOrderStatus(order: any) {
    const newStatus = order.order_status;
    console.log('New Status:', newStatus); // Kiểm tra trạng thái mới
    const allowedStatuses = this.getAllowedStatuses(order.order_status);
  
    if (allowedStatuses.some(status => status.value === newStatus)) {
      this.orderService.updateOrderStatus(order._id, newStatus).subscribe(
        (response) => {
          console.log('Cập nhật trạng thái thành công:', response); // Kiểm tra phản hồi từ backend
          this.fetchOrders();
        },
        (error) => {
          console.error('Lỗi khi cập nhật trạng thái:', error);
        }
      );
    } else {
      console.error('Trạng thái không hợp lệ');
      alert('Trạng thái không hợp lệ. Vui lòng chọn trạng thái phù hợp.');
    }
  }
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }  

  get paginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginated = this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
    console.log('Paginated Orders:', paginated); // Kiểm tra dữ liệu phân trang
    return paginated;
  }
}