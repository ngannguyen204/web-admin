import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promotions',
  standalone: false,
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent {
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  promotions = [
    { id: '#89018', code: '1278MXQ12', detail: 'Giảm giá mùa tựu trường', start: '2025-03-01', end: '2025-03-31', discount: 30, minValue: 1000000, status: 'Đang diễn ra' },
    // ... thêm các mục khác
  ];

  constructor(private router: Router) {}
  // Hàm tìm kiếm chương trình khuyến mãi
  searchPromotions() {
    console.log('Đang tìm kiếm:', this.searchText);
    // Viết logic tìm kiếm tại đây, ví dụ: lọc danh sách chương trình khuyến mãi
  }

  showAddPromotionForm() {
    this.router.navigate(['/promotion-add']); // Chuyển sang trang thêm
  }

  deletePromotion(id: string) {
    this.promotions = this.promotions.filter(promo => promo.id !== id);
  }

  filteredPromotions() {
    return this.promotions
      .filter(promo => promo.detail.toLowerCase().includes(this.searchText.toLowerCase()))
      .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.promotions.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
