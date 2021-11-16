export class BranchModel {
  constructor(
    public branch_id: number,
    public name: string,
    public latitude: number,
    public longitude: number,
    public number_of_tables: number,
    public email: string,
    public phone_number: number,
    public logo_url: string,
    public menu_url: string,
    public mode: number,
    public owner_id: number
  ) {
  }
}

export class UserModel {
  constructor(
    public id: number,
    public first_name: string,
    public last_name: string,
    public password: string,
    public email: string,
    public isAdmin: number
  ) {
  }
}

export class OrderModel {
  constructor(
    public order_id: number,
    public branch_id: number,
    public user_id: number,
    public status: string,
    public content: string,
    public table_number: number,
    public timestamp: string
  ) {
  }
}
