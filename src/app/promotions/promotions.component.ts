import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Promotion } from '../class/promotion';
import { PromotionService } from '../promotion.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-promotions',
  standalone: false,
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 6;
  promotions: Promotion[] = [];
  originalPromotions: Promotion[] = [];

  selectedPromoId: string | null = null;
  isConfirmDialogVisible = false;
  showPopup = false;
  popupMessage = '';
  categoryMap: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private promotionService: PromotionService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadPromotions();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categoryMap) => {
        this.categoryMap = categoryMap;
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadPromotions() {
    this.promotionService.getAllPromotions().subscribe(
      (data: Promotion[]) => {
        this.originalPromotions = data;
        this.promotions = [...data]; // Ensure a fresh copy
      },
      (error) => {
        console.error('Error loading promotions:', error);
      }
    );
  }

  searchPromotions() {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      this.promotions = [...this.originalPromotions];
    } else {
      this.promotions = this.originalPromotions.filter(promo =>
        promo.promotionid?.toLowerCase().includes(search) ||
        promo.promotioncode?.toLowerCase().includes(search) ||
        promo.categoryid?.toLowerCase().includes(search)
      );
    }
    this.currentPage = 1;
  }

  get paginatedPromotions(): Promotion[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.promotions.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.promotions.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  showAddPromotionForm() {
    this.router.navigate(['/promotion-add']);
  }

  editPromotion(promo: Promotion) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showPopupMessage("Please log in to edit promotions.");
      return;
    }
    this.router.navigate(['/promotion-add', promo.promotionid]);
  }

  showConfirmDeleteDialog(id: string) {
    this.selectedPromoId = id;
    this.isConfirmDialogVisible = true;
  }

  confirmDelete() {
    if (this.selectedPromoId) {
      this.promotionService.deletePromotion(this.selectedPromoId).subscribe({
        next: () => {
          this.loadPromotions();
          this.closeConfirmDialog();
        },
        error: (error) => {
          console.error("Failed to delete promotion:", error);
          this.showPopupMessage("Failed to delete promotion.");
        }
      });
    }
  }

  closeConfirmDialog() {
    this.isConfirmDialogVisible = false;
    this.selectedPromoId = null;
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
