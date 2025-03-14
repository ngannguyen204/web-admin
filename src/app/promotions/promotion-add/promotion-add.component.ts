import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promotion-add',
  standalone: false,
  templateUrl: './promotion-add.component.html',
  styleUrls: ['./promotion-add.component.css']
})
export class PromotionAddComponent {
  promotion = { 
    id: '',
    code: '',
    applyCode: '',
    detail: '',
    start: '',
    end: '',
    discount: null as number | null,
    minValue: null as number | null
  };

  constructor(private router: Router) {}

  addPromotion() {
    if (!this.isFormValid()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    this.promotion.id = this.generateId(); 
    alert("Thêm chương trình giảm giá thành công!");

    // Quay lại trang danh sách promotions
    this.router.navigate(['/promotions']);
  }

  cancelAdd() {
    this.router.navigate(['/promotions']); // Quay lại danh sách khi ấn hủy
  }

  isFormValid(): boolean {
    return (
      this.promotion.code.trim() !== '' &&
      this.promotion.applyCode.trim() !== '' &&
      this.promotion.detail.trim() !== '' &&
      this.promotion.start.trim() !== '' &&
      this.promotion.end.trim() !== '' &&
      this.promotion.discount !== null &&
      this.promotion.minValue !== null
    );
  }

  generateId(): string {
    return `#P${Math.floor(Math.random() * 10000)}`;
  }
}
