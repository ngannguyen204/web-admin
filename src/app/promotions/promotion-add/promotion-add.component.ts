import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PromotionService } from '../../promotion.service';
import { Promotion } from '../../class/promotion';
import { ProductService } from '../../product.service';

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
  categories: { [key: string]: string } = {};


  startDateString: string = '';
  endDateString: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private promotionService: PromotionService,
    private productService: ProductService
  ) {}

  ngOnInit() {
  this.route.params.subscribe(params => {
    const id = params['id'];
    if (id) {
      this.isEditing = true;
      this.loadPromotionData(id);
    } else {
      // When adding: generate new ID + default isused false
      this.isEditing = false;
      this.generatePromotionId(); 
      this.promotion.isused = false;
    }
  });
  this.loadCategories();
}

generatePromotionId() {
  this.promotionService.getAllPromotions().subscribe(promos => {
    const ids = promos
  .map(p => parseInt(p.promotionid?.replace('promo', ''), 10))
  .filter(num => !isNaN(num));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    this.promotion.promotionid = `promo${String(maxId + 1).padStart(3, '0')}`;
  });
}

// Ensure valid type before sending
savePromotion() {
  if (!this.isFormValid()) {
    this.showPopupMessage("Please fill in all required fields.");
    return;
  }

  this.promotion.validfrom = new Date(this.startDateString);
  this.promotion.validuntil = new Date(this.endDateString);

  // in case someone bypasses the disabled field
  this.promotion.isused = !!this.promotion.isused;

  const save$ = this.isEditing
    ? this.promotionService.updatePromotion(this.promotion.promotionid, this.promotion)
    : this.promotionService.createPromotion(this.promotion);

  save$.subscribe({
    next: () => {
      this.showPopupMessage(this.isEditing ? "Promotion updated!" : "Promotion created!");
      setTimeout(() => this.router.navigate(['/promotions']), 1500);
    },
    error: () => this.showPopupMessage("Save failed.")
  });
}


  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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

  cancelAdd() {
    this.router.navigate(['/promotions']);
  }

  isFormValid(): boolean {
    return (
      this.promotion.promotioncode.trim() !== '' &&
      this.promotion.discounttype.trim() !== '' &&
      !isNaN(this.promotion.discountvalue) &&
      this.promotion.categoryid.trim() !== '' &&
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
