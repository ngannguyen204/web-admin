export class Customer {
    _id: string 
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    password: string;
    buying_points: number;
    created_at: Date;
    avatar?: string;
    address_array: { first_name: string; last_name: string; phone_number: string; address: string }[];

    constructor(
        _id: string,
        first_name: string,
        last_name: string,
        email: string,
        phone_number: string,
        address: string,
        password: string,
        buying_points: number = 0,
        created_at?: Date,
        avatar?: string,
        address_array?: { first_name: string; last_name: string; phone_number: string; address: string }[]
    ) {
        this._id = _id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_number = phone_number;
        this.address = address;
        this.password = password;
        this.buying_points = buying_points;
        this.created_at = created_at || new Date();
        this.avatar = avatar;
        this.address_array = address_array || [];
    }
}