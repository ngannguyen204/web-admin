import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../class/admin';
import { Customer } from '../class/customer';
import { AdminAccountService } from '../admin-account.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-account',
  standalone: false,
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.css']
})
export class AdminAccountComponent implements OnInit {
  isAdminView: boolean = true;
  searchText: string = '';
  showConfirmDelete: boolean = false;
  selectedItem: any = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  adminList: Admin[] = [];
  userList: Customer[] = [];

  private refreshInterval: any;

  constructor(private router: Router, private adminAccountService: AdminAccountService) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadCustomers();

    this.refreshInterval = setInterval(() => {
      if (!this.isAdminView) {
        this.loadCustomers();
      }
    }, 10000); 
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadAdmins(): void {
    this.adminAccountService.getAdmins().subscribe(
      (admins: Admin[]) => {
        this.adminList = admins;
      },
      (error) => {
        console.error('Error loading admins:', error);
      }
    );
  }

  loadCustomers(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.adminAccountService.getCustomers(headers).subscribe(
      (response: { success: boolean, customers: Customer[] }) => {
        this.userList = response.customers || [];
      },
      (error) => {
        console.error('Error loading customers:', error);
        this.userList = [];
      }
    );
  }

  toggleView(): void {
    this.isAdminView = !this.isAdminView;
    this.searchText = '';
    this.currentPage = 1;
  }

  getFilteredAdmins(): Admin[] {
    return this.adminList.filter(admin =>
      admin.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
      admin.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getFilteredUsers(): Customer[] {
    if (!Array.isArray(this.userList)) {
      console.error('userList is not an array:', this.userList);
      return [];
    }
    return this.userList.filter(user =>
      user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getPagedAdmins(): Admin[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.getFilteredAdmins().slice(start, start + this.itemsPerPage);
  }

  getPagedUsers(): Customer[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const filteredUsers = this.getFilteredUsers();
    return filteredUsers.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    const totalItems = this.isAdminView ? this.getFilteredAdmins().length : this.getFilteredUsers().length;
    return Math.ceil(totalItems / this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  showDeletePopup(item: any): void {
    this.selectedItem = item;
    this.showConfirmDelete = true;
  }

  hideDeletePopup(): void {
    this.showConfirmDelete = false;
  }

  editAdmin(admin: Admin): void {
    admin.isEditing = true;
  }

  saveAdmin(admin: Admin): void {
    admin.isEditing = false;
    this.adminAccountService.updateAdmin(admin.adminid, admin).subscribe(
      (updatedAdmin: Admin) => {
        console.log('Admin updated:', updatedAdmin);
      },
      (error) => {
        console.error('Error updating admin:', error);
      }
    );
  }

  deleteItem(): void {
    if (this.selectedItem) {
      if (this.isAdminView) {
        this.adminAccountService.deleteAdmin(this.selectedItem.adminid).subscribe(
          () => {
            this.adminList = this.adminList.filter(admin => admin.adminid !== this.selectedItem.adminid);
            this.hideDeletePopup();
          },
          (error) => {
            console.error('Error deleting admin:', error);
          }
        );
      } else {
        // Handle customer deletion if needed
      }
    }
  }

  goToAddAccountPage(): void {
    this.router.navigate(['/admin-account-add']);
  }
}
