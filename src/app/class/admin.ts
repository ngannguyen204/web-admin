export class Admin {
    _id: string;
    email: string;
    username:string;
    password: string;
    created_at: Date;
    last_login: Date;
    isEditing: boolean;

    constructor(
        _id: string,
        email: string,
        username:string,
        password: string,
        created_at: Date,
        last_login: Date,
        isEditing: boolean =false
    ) {
        this._id = _id;
        this.email = email;
        this.username =username;
        this.password = password;
        this.created_at = created_at || new Date();
        this.last_login = last_login || new Date();
        this.isEditing = isEditing;
    }
}