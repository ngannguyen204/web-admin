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

  savePromotion() {
    if (!this.isFormValid()) {
      this.showPopupMessage("Please fill in all required fields.");
      return;
    }

    // Convert to ISO before saving
    this.promotion.validfrom = new Date(this.promotion.validfrom).toISOString();
    this.promotion.validuntil = new Date(this.promotion.validuntil).toISOString();
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

  loadPromotionData(id: string) {
    this.promotionService.getPromotionById(id).subscribe(promotion => {
      if (promotion) {
        this.promotion = new Promotion(promotion); // constructor will parse validfrom/until
      } else {
        this.showPopupMessage("Promotion not found.");
      }
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

  cancelAdd() {
    this.router.navigate(['/promotions']);
  }

  isFormValid(): boolean {
    return (
      this.promotion.promotioncode.trim() !== '' &&
      this.promotion.discounttype.trim() !== '' &&
      !isNaN(this.promotion.discountvalue) &&
      this.promotion.categoryid.trim() !== '' &&
      !!this.promotion.validfrom &&
      !!this.promotion.validuntil
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
