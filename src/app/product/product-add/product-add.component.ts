import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-add',
  standalone: false,
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent {
  @Input() product: any = { id: null, name: '', code: '', price: null, quantity: null, description: '', category: '' };
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  isConfirmPopupVisible = false; // Trạng thái hiển thị popup xác nhận

  saveProduct() {
    if (!this.product.name || !this.product.code || !this.product.price || !this.product.quantity || !this.product.description || !this.product.category) {
      this.isConfirmPopupVisible = true; // Hiển thị popup cảnh báo
    } else {
      this.save.emit(this.product);
      this.close.emit();
    }
  }

  cancelAction() {
    this.isConfirmPopupVisible = false;
    this.close.emit(); // Đóng form
  }

  continueAction() {
    this.isConfirmPopupVisible = false; // Đóng popup, quay lại điền form
  }
}
