import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Promotion } from '../class/promotion';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-promotions',
  standalone: false,
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  promotions: Promotion[] = [];
  selectedPromoId: string | null = null;
  isConfirmDialogVisible = false;
  showPopup = false; // Biến điều khiển hiển thị popup
  popupMessage = ''; // Nội dung popup
  
  constructor(private router: Router, private promotionService: PromotionService) {}

  ngOnInit() {
    this.loadPromotions();
  }

  // Lấy danh sách khuyến mãi từ API
  loadPromotions() {
    this.promotionService.getAllPromotions().subscribe(
      (data: Promotion[]) => {
        console.log('Dữ liệu API trả về:', data);
        this.promotions = data.map(promo => ({
          ...promo,
          discount_percent: this.parseNumberDecimal(promo.discount_percent),
          min_order_value: this.parseNumberDecimal(promo.min_order_value)
        }));
      },
      (error) => {
        console.error('Lỗi khi tải danh sách khuyến mãi:', error);
      }
    );
  }
  
  // Hàm hỗ trợ chuyển đổi numberDecimal
parseNumberDecimal(value: any): number {
  if (value && typeof value === 'object' && '$numberDecimal' in value) {
    // Trích xuất giá trị từ trường $numberDecimal và chuyển đổi thành số
    return parseFloat(value.$numberDecimal);
  } else if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'string') {
    return parseFloat(value);
  } else {
    return 0; // Giá trị mặc định nếu không thể chuyển đổi
  }
}
  // Tìm kiếm khuyến mãi
  searchPromotions() {
    if (!this.searchText) {
      this.loadPromotions(); // Nếu không có từ khóa, load lại danh sách gốc
    } else {
      this.promotions = this.promotions.filter(promo =>
        promo.promotion_title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        promo.promotion_code.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  // Điều hướng đến trang thêm khuyến mãi
  showAddPromotionForm() {
    this.router.navigate(['/promotion-add']);
  }

  editPromotion(promo: any) {
    const token = localStorage.getItem('token');
    if (!token) {
        this.showPopupMessage("Vui lòng đăng nhập để chỉnh sửa khuyến mãi!"); // Hiển thị thông báo
        return;
    }
    this.router.navigate(['/promotion-add', promo._id]); // Chuyển hướng đến trang chỉnh sửa
}
  // Mở popup xác nhận xóa
  showConfirmDeleteDialog(id: string) {
    this.selectedPromoId = id;
    this.isConfirmDialogVisible = true;
  }

  // Xác nhận xóa khuyến mãi
  confirmDelete() {
    if (this.selectedPromoId) {
        this.promotionService.deletePromotion(this.selectedPromoId).subscribe({
            next: () => {
                this.loadPromotions(); // Gọi lại API sau khi xóa
                this.closeConfirmDialog();
            },
            error: (error) => {
                console.error("Lỗi khi xóa khuyến mãi:", error);
                this.showPopupMessage("Không thể xóa khuyến mãi!");
            }
        });
    }
}

  // Đóng popup xác nhận xóa
  closeConfirmDialog() {
    this.isConfirmDialogVisible = false;
    this.selectedPromoId = null;
  }

  // Lọc danh sách theo từ khóa tìm kiếm
  filteredPromotions(): Promotion[] {
    return this.promotions
      .filter(promo =>
        promo.promotion_title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        promo.promotion_code.toLowerCase().includes(this.searchText.toLowerCase())
      )
      .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  // Lấy tổng số trang
  get totalPages(): number {
    return Math.ceil(this.promotions.length / this.itemsPerPage);
  }

  // Chuyển đến trang tiếp theo
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Quay lại trang trước
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
}

// Đóng popup
closePopup() {
    this.showPopup = false;
}
}