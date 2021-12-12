
import {BranchModel, RestauranteModel, RestaurantModel} from "./objects.model";

export abstract class BrachesTranslator{
}

export class RestauranteToBranchTranslator implements BrachesTranslator{

  public static translate(restaurante: RestauranteModel, imagen: string): BranchModel {
    let branch = new BranchModel(
      restaurante.id,//public branch_id: number,
      restaurante.name,//public name: string,
      restaurante.latitude,//public latitude: number,
      restaurante.longitude,//public longitude: number,
      0,//public number_of_tables: number,
      'Sin Mail',//public email: string,
      restaurante.phoneNumber,//public phone_number: number,
      //'http://ver-la-carta.herokuapp.com/imagen/' + imagen,//public logo_url: string,
      'https://agroworldspain.com/img/noimage.png',//public logo_url: string,
      'http://ver-la-carta.herokuapp.com/carta/' + restaurante.id,//public menu_url: string,
      'PICK_UP',//public mode: number,
      -1,//public owner_id: number,
      restaurante.appId//public appId: number
    );
    return branch;
  }

}

export class RestaurantToBranchTranslator implements BrachesTranslator{

  public static translate(restaurant: RestaurantModel): BranchModel {
    let branch = new BranchModel(
      restaurant.id,//public branch_id: number,
      restaurant.name,//public name: string,
      restaurant.latitude,//public latitude: number,
      restaurant.longitude,//public longitude: number,
      restaurant.tables.length,//public number_of_tables: number,
      'Sin Mail',//public email: string,
      0,//public phone_number: number,
      'https://agroworldspain.com/img/noimage.png',//public logo_url: string,
      restaurant.menu_link,//public menu_url: string,
      (restaurant.has_pickup)?'PICK_UP':'IN_PLACE',//public mode: number,
      -1,//public owner_id: number,
      restaurant.appId//public appId: number
    );
    return branch;
  }

}
