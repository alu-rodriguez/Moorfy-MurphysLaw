import {Injectable} from "@angular/core";
import { environment } from "src/environments/environment";
import {BranchModel, RestauranteModel, UserModel, RestaurantItemsModel, RestaurantModel} from "./objects.model";
import { RestauranteToBranchTranslator, RestaurantToBranchTranslator } from "./objects.translator";

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

enum WebAppsNames {
  OurApp = 'moorfy',
  appId1 = 'ver-la-carta',
  appId2 = 'arquiweb-tp1'
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

const fetchAndParseResponse = async <T>(args: ApiFetchArguments, urlBase: String) => {
  const response = await apiFetch<T>(args, urlBase);
  return await (response.json() as Promise<T>);
}

const fetchAndParseResponseWithParams = async <T>(args: ApiFetchArgumentsWitParams, urlBase: String) => {
  const response = await apiFetchWithParams<T>(args, urlBase);
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
      method: HttpMethod.Put,
      path
    },
    urlBase);
  }

    const apiPost = <T>(path: string, urlBase: String) => {
      return fetchAndParseResponse<T>({
        method: HttpMethod.Post,
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
      method: HttpMethod.Put,
      path,
      params
    },
    urlBase);
  }

    const apiPostWithParams = <T>(path: string, params: string, urlBase: String) => {
      return fetchAndParseResponseWithParams<T>({
        method: HttpMethod.Post,
        path,
        params
      },
      urlBase);
}

// Para probar
export const getAppInfo = () => {
  return apiGet<{name: string}>('/api/app-info', environment.ourBaseURL);
}

@Injectable()
export class SharedAppsApiService{

  constructor(private clientsApi: ClientsApiService, private app1Api: App1ApiService,
    private app2Api: App2ApiService) {
}

  public async getBranches() {
    let ourBranches : BranchModel[] = await this.clientsApi.getBranches();
    let app1Branches : BranchModel[] = await this.getApp1Branches();
    let app2Branches : BranchModel[] = await this.getApp2Branches();

    let allBranches : BranchModel[] = [];
    return allBranches.concat(ourBranches).concat(app1Branches).concat(app2Branches);
  }

  private async getApp1Branches(): Promise<BranchModel[]> {
    let app1Restaurantes: RestauranteModel[] = await this.app1Api.getRestaurantes();
    let app1Branches: BranchModel[] = [];
    for(let i = 0; i < app1Restaurantes.length; i++) {
      let aBranch: BranchModel = RestauranteToBranchTranslator.translate(app1Restaurantes[i]);
      app1Branches.push(aBranch);
    }
    return app1Branches;
  }

  private async getApp2Branches(): Promise<BranchModel[]> {
    let app2RestaurantItems: RestaurantItemsModel = await this.app2Api.getRestaurants();
    let app2Restaurants : RestaurantModel[] = app2RestaurantItems.items;
    let app2Branches: BranchModel[] = [];
    for(let i = 0; i < app2Restaurants.length; i++) {
      let aBranch: BranchModel = RestaurantToBranchTranslator.translate(app2Restaurants[i]);
      app2Branches.push(aBranch);
    }
    return app2Branches;
  }
}

@Injectable()
export class ClientsApiService{

  public getBranchesOld() {
    let branches = apiGet<{branches: string}[]>('/clients/branches', environment.ourBaseURL);
    return branches;
  }

  public getBranches(): Promise<BranchModel[]> {
    return apiGet<BranchModel[]>('/clients/branches', environment.ourBaseURL);
  }

  public placeAnOrder(params:string){
    return apiPostWithParams<{response : string}>('/clients/place_an_order',params, environment.ourBaseURL);
  }

}

@Injectable()
export class App1ApiService{

  public getRestaurantes(): Promise<RestauranteModel[]> {
    return apiGet<RestauranteModel[]>('/restaurantes/', environment.app1BaseURL);
  }

}

@Injectable()
export class App2ApiService{

  public getRestaurants(): Promise<RestaurantItemsModel> {
    return apiGet<RestaurantItemsModel>('/api/restaurants', environment.app2BaseURL);
  }

}

@Injectable()
export class OwnersApiService{

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
export class GeneralApiService{

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
