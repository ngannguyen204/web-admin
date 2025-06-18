import { Component, OnInit } from '@angular/core';
import { Product } from '../class/product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 7;
  isAdding = false;
  isEditing = false;
  showConfirmDelete = false;

  selectedProduct: Product = {
    productid: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryid: '',
    ratings: 0
  };

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categoryMap: { [key: string]: string } = {};


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategoriesAndProducts();
  }

  loadCategoriesAndProducts(): void {
  this.productService.getCategories().subscribe({
    next: (categoryMap) => {
      this.categoryMap = categoryMap;
      this.loadProducts(); // Gọi sau khi đã có categoryMap
    },
    error: (err) => console.error('Failed to load categories', err)
  });
}

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...this.products];
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  loadCategories(): void {
  this.productService.getCategories().subscribe({
    next: (categoryMap) => {
      this.categoryMap = categoryMap;
    },
    error: (err) => console.error('Failed to load categories', err)
  });
}

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }
  
  searchProducts(): void {
    const search = this.searchText?.toLowerCase().trim() || '';
    this.filteredProducts = this.products.filter(p => {
      const productName = p.name.toLowerCase();
      const productId = p.productid.toString();
      return productName.includes(search) || productId.includes(search);
    });
    this.currentPage = 1;
  }

  confirmDelete(product: Product): void {
    this.showConfirmDelete = true;
    this.selectedProduct = product;
  }

  deleteProduct(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.productid).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.productid !== this.selectedProduct!.productid);
          this.filteredProducts = [...this.products];
          this.showConfirmDelete = false;
        },
        error: (err) => console.error('Failed to delete product', err)
      });
    }
  }

  showAddForm(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedProduct = {
      productid: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      categoryid: '',
      ratings: 0
    };
  }

  editProduct(product: Product): void {
    this.isAdding = true;
    this.isEditing = true;
    this.selectedProduct = { ...product };
  }

  addProduct(newProduct: Product): void {
    if (this.isEditing && this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.productid, newProduct).subscribe({
        next: () => {
          this.loadProducts(); // reload sau khi cập nhật
          this.isAdding = false;
        },
        error: (err) => {
          console.error('Failed to update product:', err);
        }
      });
    } else {
      this.productService.createProduct(newProduct).subscribe({
        next: () => {
          this.loadProducts(); // reload sau khi tạo mới
          this.isAdding = false;
        },
        error: (err) => {
          console.error('Failed to create product:', err);
        }
      });
    }
  }

  hideForm(): void {
    this.isAdding = false;
    this.isEditing = false;
  }

  hideDeletePopup(): void {
  this.showConfirmDelete = false;
  }


  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
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
