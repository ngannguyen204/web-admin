export class Promotion {
    _id: string = '';
    promotion_code: string = '';
    promotion_status: string = '';
    start_date: Date = new Date();
    end_date: Date = new Date();
    min_order_value: number = 0;
    discount_percent: number = 0;
    promotion_title: string = '';

    constructor(init?: Partial<Promotion>) {
        if (init) {
            // Chuyển đổi chuỗi start_date và end_date thành đối tượng Date nếu cần
            if (init.start_date) {
                this.start_date = typeof init.start_date === 'string' ? new Date(init.start_date) : init.start_date;
            }
            if (init.end_date) {
                this.end_date = typeof init.end_date === 'string' ? new Date(init.end_date) : init.end_date;
            }

            // Gán các giá trị khác từ init vào đối tượng hiện tại
            Object.assign(this, init);
        }
    }
}