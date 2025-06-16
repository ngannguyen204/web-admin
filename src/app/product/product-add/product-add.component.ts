import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../class/product';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-add',
  standalone: false,
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent {
  @Input() product: Product = { 
    _id: '', 
    product_name: '', 
    description: '', 
    price: 0, 
    stock: 0, 
    material: '', 
    gender: [], 
    face_shape: [], 
    glasses_shape: '', 
    created_at: new Date(), 
    updated_at: new Date(), 
    category: '', 
    total_sold: 0, 
    colour: '', 
    product_image: '',
    review_count: 0, 
    average_rating: 0 
  };
  @Output() save = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();

  isConfirmPopupVisible = false;
  isSuccessPopupVisible = false; // Thêm biến để kiểm soát hiển thị popup thông báo thành công
  successMessage = ''; // Thêm biến để lưu thông báo thành công
  categories: string[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.product.product_image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct(): void {
    if (!this.product.product_name || !this.product.price || !this.product.stock || !this.product.category || !this.product.colour || !this.product.face_shape || !this.product.glasses_shape || !this.product.gender) {
      this.isConfirmPopupVisible = true;
    } else {
      console.log("Product data to be saved:", this.product); // Log dữ liệu trước khi gửi
      this.save.emit(this.product);
      this.showSuccessPopup(); // Hiển thị popup thông báo thành công
    }
  }

  showSuccessPopup(): void {
    this.isSuccessPopupVisible = true;
    this.successMessage = this.product._id ? 'Cập nhật thành công' : 'Tạo mới thành công';
  }

  // Thêm phương thức để đóng popup thông báo thành công
  closeSuccessPopup(): void {
    this.isSuccessPopupVisible = false;
  }

  cancelAction(): void {
    this.isConfirmPopupVisible = false;
    this.close.emit();
  }

  continueAction(): void {
    this.isConfirmPopupVisible = false;
  }
}