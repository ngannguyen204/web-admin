export class Order {
  orderid: string;
  orderdate: string;
  paymentmethod: string;
  userid: string;
  status: string;
  totalamount: number;
  totalafterpromo: number;
  promovalue: number;
  shippingdetails: {
    address: string;
    estimatedDelivery: string;
    phonenumber: string;
  };
  products: {
    productid: string;
    quantity: number;
    price: number;
    allowreview: boolean;
  }[];

  constructor(init?: Partial<Order>) {
    this.orderid = init?.orderid || '';
    this.orderdate = init?.orderdate || '';
    this.paymentmethod = init?.paymentmethod || '';
    this.userid = init?.userid || '';
    this.status = init?.status || '';
    this.totalamount = init?.totalamount || 0;
    this.totalafterpromo = init?.totalafterpromo || 0;
    this.promovalue = init?.promovalue || 0;
    this.shippingdetails = init?.shippingdetails || {
      address: '',
      estimatedDelivery: '',
      phonenumber: ''
    };
    this.products = init?.products || [];
  }
}
