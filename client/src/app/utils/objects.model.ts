export class BranchModel {
  constructor(
    public name: string,
    public latitude: number,
    public longitude: number,
    public number_of_tables: bigint,
    public email: string,
    public phone_number: bigint,
    public logo_url: string,
    public menu_url: string,
    public mode: bigint
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
