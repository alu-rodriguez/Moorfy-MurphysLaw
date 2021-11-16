export class BranchModel {
  constructor(
    public name: string,
    public latitude: number,
    public longitude: number,
    public number_of_tables: number,
    public email: string,
    public phone_number: number,
    public logo_url: string,
    public menu_url: string,
    public mode: number
  ) {
  }
}

export class UserModel {
  constructor(
    public id: bigint,
    public first_name: string,
    public last_name: string,
    public password: string,
    public email: string,
    public isAdmin: boolean
  ) {
  }
}
