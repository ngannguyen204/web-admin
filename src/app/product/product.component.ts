import { Component } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  searchText: string = '';
  isAdding = false;
  isEditing = false;
  showConfirmDelete = false;
  selectedProduct: any = null;

  products = [
    { id: 89018, name: 'abx', price: 690000, quantity: 63, category: 'Kính mắt' },
    { id: 12345, name: 'xyz', price: 850000, quantity: 25, category: 'Thời trang' },
    { id: 67890, name: 'abc', price: 720000, quantity: 12, category: 'Kính râm' }
  ];

  filteredProducts = [...this.products];

  searchProducts() {
    const search = this.searchText?.toLowerCase().trim() || '';

    this.filteredProducts = this.products.filter(p => {
      const productName = p.name.toLowerCase();
      const productId = p.id.toString();
      return productName.startsWith(search) || productId.startsWith(search);
    });
  }
  hideDeletePopup() {
    this.showConfirmDelete = false;
  }
  deleteProduct() {
  this.products = this.products.filter(p => p.id !== this.selectedProduct.id);
  this.filteredProducts = [...this.products];
  this.showConfirmDelete = false;
}
confirmDelete(product: any) {
  this.showConfirmDelete = true;
  this.selectedProduct = product;
}

editProduct(product: any) {
  this.isAdding = true;
  this.isEditing = true;
  this.selectedProduct = { ...product }; // Sao chép sản phẩm để chỉnh sửa
}
  showAddForm() {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedProduct = { id: null, name: '', price: null, quantity: null, category: '' };
  }
  addProduct(newProduct: any) {
    if (newProduct.name && newProduct.price !== null && newProduct.quantity !== null && newProduct.category) {
      newProduct.id = Math.floor(10000 + Math.random() * 90000);
      this.products.push(newProduct);
      this.filteredProducts = [...this.products];
      this.isAdding = false;
    } else {
      this.isAdding = false; // ✅ Reset form nếu không hợp lệ
    }
  }  
  

  hideForm() {
    this.isAdding = false;
    this.isEditing = false;
  }
}
