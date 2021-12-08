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
    public mode: string,
    public owner_id: number,
    public appId: number
  ) {
  }
}

export class RestauranteModel {
  constructor(
    public id: number,
    public name: string,
    public latitude: number,
    public longitude: number,
    public phoneNumber: number,
    public workingHours: number,
    public appId: number
  ) {
  }
}

export class RestaurantItemsModel {
  constructor(
    public items: RestaurantModel[]
  ){
  }
}


export class RestaurantModel {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public latitude: number,
    public longitude: number,
    public has_pickup: boolean,
    public menu_link: string,
    public order_link: string,
    public appId: number,
    public tables: RestaurantTableModel[]
  ) {
  }
}

export class RestaurantTableModel {
  constructor(
    public id: number,
    public name: string
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
    public is_admin: number
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
