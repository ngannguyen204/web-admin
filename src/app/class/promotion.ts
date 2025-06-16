export class Promotion {
  promotionid: string = '';
  promotioncode: string = '';
  discounttype: string = ''; // e.g., 'percentage' or 'fixed'
  discountvalue: number = 0;
  category: string = '';
  userid: string = '';
  isused: boolean = false;
  validfrom: Date = new Date();
  validuntil: Date = new Date();

  constructor(init?: Partial<Promotion>) {
    if (init) {
      if (init.validfrom) {
        this.validfrom = typeof init.validfrom === 'string' ? new Date(init.validfrom) : init.validfrom;
      }
      if (init.validuntil) {
        this.validuntil = typeof init.validuntil === 'string' ? new Date(init.validuntil) : init.validuntil;
      }

      Object.assign(this, init);
    }
  }
}
