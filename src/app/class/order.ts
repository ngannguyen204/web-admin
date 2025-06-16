export class Order {
    _id: string;
    order_date: Date;
    total_price: number;
    total_discount: number;
    total_amount: number;
    order_status: string;
    delivery_address: string;
    customer_id: string;
    items: { product_id: string; quantity: number; item_price: number }[];

    constructor(
        _id: string,
        order_date: Date,
        total_price: number,
        total_discount: number,
        total_amount: number,
        order_status: string,
        delivery_address: string,
        customer_id: string,
        items: { product_id: string; quantity: number; item_price: number }[]
    ) {
        this._id = _id;
        this.order_date = order_date;
        this.total_price = total_price;
        this.total_discount = total_discount;
        this.total_amount = total_amount;
        this.order_status = order_status;
        this.delivery_address = delivery_address;
        this.customer_id = customer_id;
        this.items = items;
    }
}