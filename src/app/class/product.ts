export class Product {
  productid: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryid: string;
  ratings: number;

  constructor(init?: Partial<Product>) {
    this.productid = init?.productid || '';
    this.name = init?.name || '';
    this.description = init?.description || '';
    this.price = init?.price || 0;
    this.stock = init?.stock || 0;
    this.image = init?.image || '';
    this.categoryid = init?.categoryid || '';
    this.ratings = init?.ratings || 0;
  }
}
