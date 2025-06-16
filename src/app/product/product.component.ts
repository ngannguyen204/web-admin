// product.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../class/product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  standalone:false,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 5;
  isAdding = false;
  isEditing = false;
  showConfirmDelete = false;
  selectedProduct: Product = { 
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

  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.map(product => ({
          ...product,
          price: this.parseNumberDecimal(product.price)
        }));
        this.filteredProducts = [...this.products];
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  parseNumberDecimal(value: any): number {
    if (value && typeof value === 'object' && '$numberDecimal' in value) {
      return parseFloat(value.$numberDecimal);
    } else if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      return parseFloat(value);
    } else {
      return 0;
    }
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  searchProducts(): void {
    const search = this.searchText?.toLowerCase().trim() || '';

    this.filteredProducts = this.products.filter(p => {
      const productName = p.product_name.toLowerCase();
      const productId = p._id.toString();
      return productName.startsWith(search) || productId.startsWith(search);
    });
    this.currentPage = 1;
  }

  hideDeletePopup(): void {
    this.showConfirmDelete = false;
  }

  deleteProduct(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct._id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== this.selectedProduct!._id);
          this.filteredProducts = [...this.products];
          this.showConfirmDelete = false;
        },
        error: (err) => console.error('Failed to delete product', err)
      });
    }
  }

  confirmDelete(product: Product): void {
    this.showConfirmDelete = true;
    this.selectedProduct = product;
  }

  editProduct(product: Product): void {
    this.isAdding = true;
    this.isEditing = true;
    this.selectedProduct = { ...product };
  }

  showAddForm(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedProduct = { 
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
  }

// product.component.ts
addProduct(newProduct: Product): void {
  if (this.isEditing && this.selectedProduct) {
    console.log("Updating product with data:", newProduct); // Log dữ liệu cập nhật
    this.productService.updateProduct(this.selectedProduct._id, newProduct).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
          this.filteredProducts = [...this.products];
        }
        this.isAdding = false;
      },
      error: (err) => {
        console.error("Failed to update product:", err); // Log lỗi chi tiết
      }
    });
  } else {
    console.log("Creating new product with data:", newProduct); // Log dữ liệu tạo mới
    this.productService.createProduct(newProduct).subscribe({
      next: (createdProduct) => {
        this.products.push(createdProduct);
        this.filteredProducts = [...this.products];
        this.isAdding = false;
      },
      error: (err) => {
        console.error("Failed to create product:", err); // Log lỗi chi tiết
      }
    });
  }
}
  hideForm(): void {
    this.isAdding = false;
    this.isEditing = false;
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}