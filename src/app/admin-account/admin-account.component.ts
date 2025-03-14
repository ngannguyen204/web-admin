import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-account',
  standalone: false,
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.css']
})
export class AdminAccountComponent {
  isAdminView: boolean = true;
  searchText: string = '';  
  showConfirmDelete: boolean = false;
  selectedItem: any = null;

  // Phân trang
  currentPage: number = 1;
  itemsPerPage: number = 5; // Số lượng item trên mỗi trang

  constructor(private router: Router) {}

  adminList = [
    { id: 'A001', username: 'admin01', employeeId: 'NV001', email: 'admin01@example.com', lastLogin: '2025-03-13 08:30', isEditing: false },
    { id: 'A002', username: 'admin02', employeeId: 'NV002', email: 'admin02@example.com', lastLogin: '2025-03-12 10:15', isEditing: false },
    { id: 'A003', username: 'admin03', employeeId: 'NV003', email: 'admin03@example.com', lastLogin: '2025-03-11 15:45', isEditing: false },
    { id: 'A004', username: 'admin04', employeeId: 'NV004', email: 'admin04@example.com', lastLogin: '2025-03-10 09:20', isEditing: false },
    { id: 'A005', username: 'admin05', employeeId: 'NV005', email: 'admin05@example.com', lastLogin: '2025-03-09 12:10', isEditing: false },
    { id: 'A006', username: 'admin06', employeeId: 'NV006', email: 'admin06@example.com', lastLogin: '2025-03-08 14:25', isEditing: false },
  ];

  userList = [
    { id: 'U001', name: 'Nguyễn Văn A', phone: '0123456789', email: 'user01@example.com', address: 'Hà Nội', points: 120, isEditing: false },
    { id: 'U002', name: 'Trần Thị B', phone: '0987654321', email: 'user02@example.com', address: 'HCM', points: 200, isEditing: false },
    { id: 'U003', name: 'Lê Văn C', phone: '0345678901', email: 'user03@example.com', address: 'Đà Nẵng', points: 150, isEditing: false },
    { id: 'U004', name: 'Phạm Thị D', phone: '0456789012', email: 'user04@example.com', address: 'Huế', points: 180, isEditing: false },
    { id: 'U005', name: 'Hoàng Văn E', phone: '0567890123', email: 'user05@example.com', address: 'Cần Thơ', points: 210, isEditing: false },
    { id: 'U006', name: 'Đỗ Thị F', phone: '0678901234', email: 'user06@example.com', address: 'Hải Phòng', points: 170, isEditing: false },
  ];

  toggleView() {
    this.isAdminView = !this.isAdminView;
    this.searchText = ''; 
    this.currentPage = 1;
  }

  getFilteredAdmins() {
    return this.adminList.filter(admin =>
      admin.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
      admin.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getFilteredUsers() {
    return this.userList.filter(user =>
      user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getPagedAdmins() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.getFilteredAdmins().slice(start, start + this.itemsPerPage);
  }

  getPagedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.getFilteredUsers().slice(start, start + this.itemsPerPage);
  }

  totalPages() {
    const totalItems = this.isAdminView ? this.getFilteredAdmins().length : this.getFilteredUsers().length;
    return Math.ceil(totalItems / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  showDeletePopup(item: any) {
    this.selectedItem = item;
    this.showConfirmDelete = true;
  }

  hideDeletePopup() {
    this.showConfirmDelete = false;
  }
  editAdmin(admin: any) {
    admin.isEditing = true;
}

saveAdmin(admin: any) {
    admin.isEditing = false;
}


  deleteItem() {
    if (this.selectedItem) {
      if (this.isAdminView) {
        this.adminList = this.adminList.filter(admin => admin.id !== this.selectedItem.id);
      } else {
        this.userList = this.userList.filter(user => user.id !== this.selectedItem.id);
      }
    }
    this.hideDeletePopup();
  }

  goToAddAccountPage() {
    this.router.navigate(['/admin-account-add']);
  }
}
