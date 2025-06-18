export class Admin {
  adminid: string;
  email: string;
  username: string;
  password: string;
  name: string;
  lastlogin: string;
  isEditing: boolean;

  constructor(
    adminid: string,
    email: string,
    username: string,
    password: string,
    name: string,
    lastlogin: string = '',
    isEditing: boolean = false
  ) {
    this.adminid = adminid;
    this.email = email;
    this.username = username;
    this.password = password;
    this.name = name;
    this.lastlogin = lastlogin;
    this.isEditing = isEditing;
  }
}
