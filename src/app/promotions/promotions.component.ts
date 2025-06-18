// promotions.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Promotion } from '../class/promotion';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-promotions',
  standalone: false,
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  promotions: Promotion[] = [];
  selectedPromoId: string | null = null;
  isConfirmDialogVisible = false;
  showPopup = false;
  popupMessage = '';

  constructor(private router: Router, private promotionService: PromotionService) {}

  ngOnInit() {
    this.loadPromotions();
  }

  loadPromotions() {
    this.promotionService.getAllPromotions().subscribe(
      (data: Promotion[]) => {
        console.log('Promotions from Firebase:', data);
        this.promotions = data;
      },
      (error) => {
        console.error('Error loading promotions:', error);
      }
    );
  }

  searchPromotions() {
    if (!this.searchText) {
      this.loadPromotions();
    } else {
      const search = this.searchText.toLowerCase();
      this.promotions = this.promotions.filter(promo =>
        promo.promotioncode.toLowerCase().includes(search) ||
        promo.category.toLowerCase().includes(search)
      );
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

  filteredPromotions(): Promotion[] {
    return this.promotions
      .filter(promo =>
        promo.promotioncode.toLowerCase().includes(this.searchText.toLowerCase()) ||
        promo.category.toLowerCase().includes(this.searchText.toLowerCase())
      )
      .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
