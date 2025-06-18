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
  categories: { [key: string]: string } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    if (!this.product.productid) {
    this.generateNextProductId();}
  }

  generateNextProductId(): void {
  this.productService.getProducts().subscribe(products => {
    const ids = products.map(p => parseInt(p.productid, 10)).filter(n => !isNaN(n));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const nextId = (maxId + 1).toString().padStart(3, '0');
    this.product.productid = nextId;
  });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  getCategoryKeys(): string[] {
  return Object.keys(this.categories);
}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.product.image = reader.result as string; // Base64 string
      };

      reader.readAsDataURL(file); // Convert to base64
    }
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
