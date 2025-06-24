export class Promotion {
  promotionid: string = '';
  promotioncode: string = '';
  discounttype: string = ''; // e.g., 'percentage' or 'fixed'
  discountvalue: number = 0;
  categoryid: string = '';
  userid: string = '';
  isused: boolean = false;
  validfrom: string = '';
  validuntil: string = '';

  
  constructor(data?: Partial<Promotion>) {
    if (data) {
      this.promotionid = data.promotionid || '';
      this.promotioncode = data.promotioncode || '';
      this.discounttype = data.discounttype || '';
      this.discountvalue = data.discountvalue || 0;
      this.categoryid = data.categoryid || '';
      this.userid = data.userid || '';
      this.isused = !!data.isused;
      this.validfrom = data.validfrom || '';
      this.validuntil = data.validuntil || '';
    }
  }
}
