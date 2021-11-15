export class Branches {
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
