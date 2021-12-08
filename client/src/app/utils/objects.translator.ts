
import {BranchModel, RestaruranteModel} from "./objects.model";

export class RestauranteToBranchTranslator{

  public static translate(restaurante: RestaruranteModel): BranchModel {
    let branch = new BranchModel(
      restaurante.id,//public branch_id: number,
      restaurante.name,//public name: string,
      restaurante.latitude,//public latitude: number,
      restaurante.longitude,//public longitude: number,
      0,//public number_of_tables: number,
      'Sin Mail',//public email: string,
      restaurante.phoneNumber,//public phone_number: number,
      'Sin Logo',//public logo_url: string,
      'Sin Menu',//public menu_url: string,
      'PICK_UP',//public mode: number,
      -1,//public owner_id: number,
      1//public appId: number
    );
    return branch;
  }

}
