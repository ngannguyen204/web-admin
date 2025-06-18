import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../../class/product';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-add',
  standalone: false,
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  @Input() product: Product = {
    productid: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryid: '',
    ratings: 0
  };

  @Output() save = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();

  isConfirmPopupVisible = false;
  isSuccessPopupVisible = false;
  successMessage = '';
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

  saveProduct(): void {
    if (
      !this.product.name ||
      !this.product.price ||
      !this.product.stock ||
      !this.product.description ||
      !this.product.categoryid
    ) {
      this.isConfirmPopupVisible = true;
    } else {
      console.log("Saving product:", this.product);
      this.save.emit(this.product);
      this.showSuccessPopup();
    }
  }

  showSuccessPopup(): void {
    this.isSuccessPopupVisible = true;
    this.successMessage = this.product.productid
      ? 'Product updated successfully'
      : 'Product created successfully';
  }

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
