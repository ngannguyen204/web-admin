export class Product {
    _id: string;
    product_name: string;
    description: string;
    price: number =0;
    stock: number;
    material: string;
    gender: string[];
    face_shape: string[];
    glasses_shape: string;
    created_at: Date;
    updated_at: Date;
    category: string;
    product_image: string;
    total_sold: number;
    colour: string;
    average_rating: number;
    review_count: number;

    constructor(
        _id: string,
        product_name: string,
        description: string,
        price: number,
        stock: number,
        material: string,
        gender: string[],
        face_shape: string[],
        glasses_shape: string,
        created_at: Date,
        updated_at: Date,
        category: string,
        product_image: string,
        total_sold: number,
        colour: string,
        average_rating: number,
        review_count: number
    ) {
        this._id = _id;
        this.product_name = product_name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.material = material;
        this.gender = gender;
        this.face_shape = face_shape;
        this.glasses_shape = glasses_shape;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.category = category;
        this.product_image = product_image;
        this.total_sold = total_sold;
        this.colour = colour;
        this.average_rating = average_rating;
        this.review_count = review_count;
    }
}
