export class Customer {
  userid: string;
  name: string;
  email: string;
  password: string;
  phonenumber: string;
  gender: string;
  profilepicture?: string;
  defaultaddress?: {
    street: string;
    city: string;
    country: string;
  };
  useractivity?: {
    activityid: string;
    action: string;
    targetid: string;
    timestamp: string;
  }[];

  constructor(init?: Partial<Customer>) {
    this.userid = init?.userid || '';
    this.name = init?.name || '';
    this.email = init?.email || '';
    this.password = init?.password || '';
    this.phonenumber = init?.phonenumber || '';
    this.gender = init?.gender || '';
    this.profilepicture = init?.profilepicture;
    this.defaultaddress = init?.defaultaddress;
    this.useractivity = init?.useractivity || [];
  }
}
