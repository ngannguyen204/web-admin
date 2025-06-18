import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PromotionService } from '../../promotion.service';
import { Promotion } from '../../class/promotion';

@Component({
  selector: 'app-promotion-add',
  standalone: false,
  templateUrl: './promotion-add.component.html',
  styleUrls: ['./promotion-add.component.css']
})
export class PromotionAddComponent implements OnInit {
  promotion: Promotion = new Promotion();
  isEditing = false;
  showPopup = false;
  popupMessage = '';

  startDateString: string = '';
  endDateString: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private promotionService: PromotionService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditing = true;
        this.loadPromotionData(id);
      }
    });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  loadPromotionData(id: string) {
    this.promotionService.getPromotionById(id).subscribe(promotion => {
      if (promotion) {
        this.startDateString = this.formatDate(promotion.validfrom);
        this.endDateString = this.formatDate(promotion.validuntil);
        this.promotion = new Promotion(promotion);
      } else {
        this.showPopupMessage("Promotion not found.");
      }
    });
  }

  savePromotion() {
    if (!this.isFormValid()) {
      this.showPopupMessage("Please fill in all required fields.");
      return;
    }

    this.promotion.validfrom = new Date(this.startDateString);
    this.promotion.validuntil = new Date(this.endDateString);

    if (this.isEditing) {
      this.promotionService.updatePromotion(this.promotion.promotionid, this.promotion).subscribe({
        next: () => {
          this.showPopupMessage("Promotion updated successfully!");
          setTimeout(() => this.router.navigate(['/promotions']), 1500);
        },
        error: () => this.showPopupMessage("Failed to update promotion.")
      });
    } else {
      this.promotionService.createPromotion(this.promotion).subscribe({
        next: () => {
          this.showPopupMessage("Promotion created successfully!");
          setTimeout(() => this.router.navigate(['/promotions']), 1500);
        },
        error: () => this.showPopupMessage("Failed to create promotion.")
      });
    }
  }

  cancelAdd() {
    this.router.navigate(['/promotions']);
  }

  isFormValid(): boolean {
    return (
      this.promotion.promotioncode.trim() !== '' &&
      this.promotion.discounttype.trim() !== '' &&
      !isNaN(this.promotion.discountvalue) &&
      this.promotion.category.trim() !== '' &&
      this.startDateString.trim() !== '' &&
      this.endDateString.trim() !== ''
    );
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
