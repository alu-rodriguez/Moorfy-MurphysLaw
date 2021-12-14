import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {BranchModel, RestauranteModel, UserModel, RestaurantItemsModel, RestaurantModel, OrderSolicitudeApp1Model, BodyModel, OrderSolicitudeApp2Model} from "./objects.model";
import {RestauranteToBranchTranslator, RestaurantToBranchTranslator} from "./objects.translator";

import { HttpHeaders } from '@angular/common/http';

enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT'
}

interface ApiFetchArguments {
  method: HttpMethod,
  path: string
}

interface ApiFetchArgumentsWitParams {
  method: HttpMethod,
  path: string,
  params: string
}

const apiFetch = async <T>({method, path}: ApiFetchArguments, urlBase: String) => {
  const options: RequestInit = {
    method: method,
  };

  const url = `${urlBase}${path}`;

  const response = await fetch(url, options);
  if (response.ok) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
}

const apiFetchWithParams = async <T>({method, path, params}: ApiFetchArgumentsWitParams, urlBase: String) => {
  const options: RequestInit = {
    method: method,
  };

  const url = `${urlBase}${path}${params}`;

  const response = await fetch(url, options);
  if (response.ok) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
}

const apiFetchWithParamsAndBody = async <T>({method, path, params}: ApiFetchArgumentsWitParams, urlBase: String, body: BodyModel) => {

  const options: RequestInit = {
    method: method,
    body: body.stringify(),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  };

  const url = `${urlBase}${path}${params}`;
  const response: Response = await fetch(url, options);
  if (response.ok) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
}

const fetchAndParseResponse = async <T>(args: ApiFetchArguments, urlBase: String) => {
  const response = await apiFetch<T>(args, urlBase);
  return await (response.json() as Promise<T>);
}

const fetchAndParseResponseWithParams = async <T>(args: ApiFetchArgumentsWitParams, urlBase: String) => {
  const response = await apiFetchWithParams<T>(args, urlBase);
  return await (response.json() as Promise<T>);
}

const fetchAndParseResponseWithParamsAndBody = async <T>(args: ApiFetchArgumentsWitParams, urlBase: String, body: BodyModel) => {
  const response = await apiFetchWithParamsAndBody<T>(args, urlBase, body);
  return await (response.json() as Promise<T>);
}

const apiGet = <T>(path: string, urlBase: String) => {
  return fetchAndParseResponse<T>({
    method: HttpMethod.Get,
    path
  },
  urlBase);
}

const apiPut = <T>(path: string, urlBase: String) => {
  return fetchAndParseResponse<T>({
    method: HttpMethod.Get,//Put
    path
  },
  urlBase);
}

const apiPost = <T>(path: string, urlBase: String) => {
  return fetchAndParseResponse<T>({
    method: HttpMethod.Get,//Post
    path
  },
  urlBase);
}

const apiGetWithParams = <T>(path: string, params: string, urlBase: String) => {
  return fetchAndParseResponseWithParams<T>({
    method: HttpMethod.Get,
    path,
    params
  },
  urlBase);
}

const apiPutWithParams = <T>(path: string, params: string, urlBase: String) => {
  return fetchAndParseResponseWithParams<T>({
    method: HttpMethod.Get,//Put
    path,
    params
  },
  urlBase);
}

const apiPostWithParams = <T>(path: string, params: string, urlBase: String) => {
  return fetchAndParseResponseWithParams<T>({
    method: HttpMethod.Get,//Post
    path,
    params
  },
  urlBase);
}

const apiPostWithParamsAndBody = <T>(path: string, params: string, urlBase: String, body: BodyModel) => {
  return fetchAndParseResponseWithParamsAndBody<T>({
    method: HttpMethod.Get,//Post
    path,
    params
  },
  urlBase,
  body);
}

// Para probar
export const getAppInfo = () => {
  return apiGet<{name: string}>('/api/app-info', environment.ourBaseURL);
}

@Injectable()
export abstract class ApiService {

  public abstract placeAnOrder(branch:BranchModel, tableId: number, user: UserModel, orderContent:string): Promise<{response : string}>;

}

@Injectable()
export class SharedAppsApiService {

  private apiAppsDictionary: { [appId: number]: ApiService } = {};

  constructor(private clientsApi: ClientsApiService, private app1Api: App1ApiService,
    private app2Api: App2ApiService) {
      this.apiAppsDictionary = {1: app1Api, 2: app2Api, 3: clientsApi}
    }

  public async getBranches() {
    let ourBranches : BranchModel[] = await this.clientsApi.getBranches();
    let app1Branches : BranchModel[] = await this.app1Api.getApp1Branches();
    let app2Branches : BranchModel[] = await this.app2Api.getApp2Branches();

    let allBranches : BranchModel[] = [];
    return allBranches.concat(ourBranches).concat(app1Branches).concat(app2Branches);
  }

  public placeAnOrder(branch:BranchModel, tableId: number, user: UserModel, orderContent: string): Promise<{response : string}>{

    let apiService: ApiService = this.apiAppsDictionary[branch.appId];
    return apiService.placeAnOrder(branch, tableId, user, orderContent);
  }

}

@Injectable()
export class ClientsApiService implements ApiService {

  public getBranchesOld() {
    let branches = apiGet<{branches: string}[]>('/clients/branches', environment.ourBaseURL);
    return branches;
  }

  public getBranches(): Promise<BranchModel[]> {
    return apiGet<BranchModel[]>('/clients/branches', environment.ourBaseURL);
  }

  public placeAnOrder(branch:BranchModel, tableId: number, user: UserModel, orderContent:string): Promise<{response : string}>{
    //# URL ejemplo: http://127.0.0.1:5000/clients/place_an_order?branch_id=1&table_id=2&user_id=3&order_content=Pido%20la%20promo%204
    let params = '?branch_id=' + branch.branch_id + '&table_id=' + tableId + '&user_id=' + user.id + '&order_content=' + orderContent;
    return apiPostWithParams<{response : string}>('/clients/place_an_order',params, environment.ourBaseURL);
  }

}

@Injectable()
export class App1ApiService implements ApiService {

  private app1UrlBase = environment.app1BaseURL;

  /*_http : any;
  constructor(http : HttpClient){
    this._http = http;
  }*/

  public async getApp1Branches(): Promise<BranchModel[]> {
    let app1Restaurantes: RestauranteModel[] = await this.getRestaurantes();
    return this.obtainBranchesFromRestaurantes(app1Restaurantes);
  }

  private getRestaurantes(): Promise<RestauranteModel[]> {
    return apiGet<RestauranteModel[]>('/restaurantes/', this.app1UrlBase);
  }

  private async obtainBranchesFromRestaurantes(app1Restaurantes: RestauranteModel[]) {
    let app1Branches: BranchModel[] = [];
    for (let i = 0; i < app1Restaurantes.length; i++) {
      //let imagen: string = await this.getFirstImageFromRestaurante(app1Restaurantes[i]);
      let aBranch: BranchModel = RestauranteToBranchTranslator.translate(app1Restaurantes[i], 'imagen');
      app1Branches.push(aBranch);
    }
    return app1Branches;
  }

  private async getFirstImageFromRestaurante(restaurante: RestauranteModel): Promise<string> {
    let imagenes: number[] = await apiGetWithParams<number[]>('/imagen/resto/', restaurante.id.toString(), environment.app2BaseURL);
    if (imagenes.length > 0) {
      return imagenes[0].toString();
    }
    else return 'Sin Logo';
  }

  public placeAnOrder(branch:BranchModel, tableId: number, user: UserModel, orderContent:string): Promise<{response : string}>{
    //# URL ejemplo: http://ver-la-carta.herokuapp.com/orders/pickup/1
    let path = '/orders/pickup/';
    let params = branch.branch_id.toString();
    let body = new OrderSolicitudeApp1Model(orderContent, user.first_name);
    //let headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    /*this._http.post(this.app1UrlBase + path + params, body.stringify, headers)
            .subscribe( (_res: any) => {alert("Ordern realizada!");},
                        (_err: any) => {alert("Error al enviar la orden!");}
                       );*/

    return apiPostWithParamsAndBody<{response : string}>(path,params, this.app1UrlBase, body);
  }

}

@Injectable()
export class App2ApiService implements ApiService {

  private app2UrlBase = environment.app2BaseURL;

  public async getApp2Branches(): Promise<BranchModel[]> {
    let app2Restaurants: RestaurantModel[] = await this.getRestaurants();
    return this.obtainBranchesFromRestaurants(app2Restaurants);
  }

  private async getRestaurants(): Promise<RestaurantModel[]> {
    let app2RestaurantItems: RestaurantItemsModel = await apiGet<RestaurantItemsModel>('/api/restaurants', this.app2UrlBase);
    return app2RestaurantItems.items;
  }

  private obtainBranchesFromRestaurants(app2Restaurants: RestaurantModel[]) {
    let app2Branches: BranchModel[] = [];
    for (let i = 0; i < app2Restaurants.length; i++) {
      let aBranch: BranchModel = RestaurantToBranchTranslator.translate(app2Restaurants[i]);
      app2Branches.push(aBranch);
    }
    return app2Branches;
  }

  public placeAnOrder(branch:BranchModel, tableId: number, user: UserModel, orderContent:string): Promise<{response : string}>{
    //# URL ejemplo: http://arquiweb-tp1.herokuapp.com/api/restaurants/1/orders/new
    let path = '/api/restaurants/';
    let params = branch.branch_id + '/orders/new';
    let body = new OrderSolicitudeApp2Model(tableId, orderContent);
    return apiPostWithParamsAndBody<{response : string}>(path,params, this.app2UrlBase, body);
  }

}

@Injectable()
export class OwnersApiService {

  public getActiveOrders(params : string) {
    return apiGetWithParams<{orders: string}[]>('/owners/active_orders', params, environment.ourBaseURL);
  }

  public getHistoricalOrders(params : string) {
    return apiGetWithParams<{orders: string}[]>('/owners/historical_orders', params, environment.ourBaseURL);
  }

  public createABranch(params:string){
    return apiPostWithParams<{response : string}>('/owners/create_a_branch',params, environment.ourBaseURL);
  }

  public aceptAnOrder(params:string){
    return apiPutWithParams<{response : string}>('/owners/acept_order',params, environment.ourBaseURL);
  }

  public rejectAnOrder(params:string){
    return apiPutWithParams<{response : string}>('/owners/reject_order',params, environment.ourBaseURL);
  }

  public startMakingAnOrder(params:string){
    return apiPutWithParams<{response : string}>('/owners/start_making_order',params, environment.ourBaseURL);
  }

  public finaliceAnOrder(params:string){
    return apiGetWithParams<{response : string}>('/owners/finalize_order',params, environment.ourBaseURL);
  }

}

@Injectable()
export class GeneralApiService {

  public getABranch(params : string) {
    return apiGetWithParams<BranchModel>('/api/obtain_a_branch', params, environment.ourBaseURL);
  }

  public getRegisteredUsers() {
    return apiGet<UserModel[]>('/api/usuarios', environment.ourBaseURL);
  }

  public getAUser(params : string) {
    return apiGetWithParams<UserModel>('/api/user/', params, environment.ourBaseURL);
  }

}
