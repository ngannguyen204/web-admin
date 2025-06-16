import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PromotionService } from '../../promotion.service';
import { Promotion } from '../../class/promotion';

@Component({
  selector: 'app-promotion-add',
  standalone: false,
  templateUrl: './promotion-add.component.html',
  styleUrls: ['./promotion-add.component.css']
})
export class PromotionAddComponent implements OnInit {
  promotion: Promotion = new Promotion();
  isEditing = false;
  showPopup = false;
  popupMessage = '';

  // Biến tạm để lưu giá trị ngày tháng dưới dạng string
  startDateString: string = '';
  endDateString: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private promotionService: PromotionService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditing = true;
        this.loadPromotionData(id);
      }
    });
  }

  // Hàm chuyển đổi ngày tháng sang định dạng yyyy-MM-dd
  formatDate(date: string | Date): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Thêm số 0 phía trước nếu cần
    const day = ('0' + dateObj.getDate()).slice(-2); // Thêm số 0 phía trước nếu cần
    return `${year}-${month}-${day}`;
  }

  // Hàm tải dữ liệu của chương trình giảm giá khi chỉnh sửa
  loadPromotionData(id: string) {
    this.promotionService.getPromotionById(id).subscribe((promotion: Promotion) => {
      // Chuyển đổi start_date và end_date sang định dạng yyyy-MM-dd để hiển thị trong form
      this.startDateString = this.formatDate(promotion.start_date);
      this.endDateString = this.formatDate(promotion.end_date);
      this.promotion = new Promotion(promotion);
    });
  }

  // Hàm lưu chương trình giảm giá (Thêm mới hoặc Cập nhật)
  savePromotion() {
    if (!this.isFormValid()) {
      this.showPopupMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Chuyển đổi start_date và end_date từ chuỗi yyyy-MM-dd sang đối tượng Date
    this.promotion.start_date = new Date(this.startDateString);
    this.promotion.end_date = new Date(this.endDateString);

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      this.showPopupMessage("Bạn cần đăng nhập để thực hiện thao tác này!");
      return;
    }

    // Thêm token vào header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (this.isEditing) {
      console.log('ID khuyến mãi được gửi từ client:', this.promotion._id);
      // Gọi phương thức updatePromotion từ PromotionService với headers
      this.promotionService.updatePromotion(this.promotion._id, this.promotion, headers).subscribe({
        next: () => {
          this.showPopupMessage("Cập nhật chương trình giảm giá thành công!");
          setTimeout(() => {
            this.router.navigate(['/promotions']);
          }, 2000);
        },
        error: (error) => {
          console.error("Lỗi khi cập nhật chương trình giảm giá:", error);
          this.showPopupMessage("Không thể cập nhật chương trình giảm giá!");
        }
      });
    } else {
      // Gọi phương thức createPromotion từ PromotionService với headers
      this.promotionService.createPromotion(this.promotion, headers).subscribe({
        next: () => {
          this.showPopupMessage("Thêm chương trình giảm giá thành công!");
          setTimeout(() => {
            this.router.navigate(['/promotions']);
          }, 2000);
        },
        error: (error) => {
          console.error("Lỗi khi thêm chương trình giảm giá:", error);
          this.showPopupMessage("Không thể thêm chương trình giảm giá!");
        }
      });
    }
  }

  cancelAdd() {
    this.router.navigate(['/promotions']);
  }

  isFormValid(): boolean {
    return (
      this.promotion.promotion_code.trim() !== '' &&
      this.promotion.promotion_title.trim() !== '' &&
      this.startDateString.trim() !== '' &&
      this.endDateString.trim() !== '' &&
      !isNaN(this.promotion.discount_percent) &&
      !isNaN(this.promotion.min_order_value)
    );
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}