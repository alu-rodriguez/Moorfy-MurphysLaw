import {Injectable} from "@angular/core";
import {BranchModel, UserModel} from "./objects.model";

enum HttpMethod {
  Get = 'GET'
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

const apiFetch = <T>({method, path}: ApiFetchArguments) => {
  const options: RequestInit = {
    method: method,
  };

  const urlBase = 'http://moorfy.com:5000';
  const url = `${urlBase}${path}`;

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        throw new Error(response.statusText);
      }
    })
}

const apiFetchWithParams = <T>({method, path, params}: ApiFetchArgumentsWitParams) => {
  const options: RequestInit = {
    method: method,
  };

  const urlBase = 'http://moorfy.com:5000';
  const url = `${urlBase}${path}${params}`;

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        throw new Error(response.statusText);
      }
    })
}

const fetchAndParseResponse = <T>(args: ApiFetchArguments) => {
  return apiFetch<T>(args)
    .then(response => response.json() as Promise<T>)
}

const fetchAndParseResponseWithParams = <T>(args: ApiFetchArgumentsWitParams) => {
  return apiFetchWithParams<T>(args)
    .then(response => response.json() as Promise<T>)
}

const apiGet = <T>(path: string) => {
  return fetchAndParseResponse<T>({
    method: HttpMethod.Get,
    path
  });
}

const apiGetWithParams = <T>(path: string, params: string) => {
  return fetchAndParseResponseWithParams<T>({
    method: HttpMethod.Get,
    path,
    params
  });
}

// Para probar
export const getAppInfo = () => {
  return apiGet<{name: string}>('/api/app-info');
}

@Injectable()
export class ClientsApiService{

  public getBranches() {
    return apiGet<{branches: string}[]>('/clients/branches');
  }
  public getBranches2(): Promise<BranchModel[]> {
    return apiGet<BranchModel[]>('/clients/branches');
  }

  public placeAnOrder(params:string){
    return apiGetWithParams<{response : string}>('/clients/place_an_order',params);
  }

}

@Injectable()
export class OwnersApiService{

  public getActiveOrders(params : string) {
    return apiGetWithParams<{orders: string}[]>('/owners/active_orders', params);
  }

  public getHistoricalOrders(params : string) {
    return apiGetWithParams<{orders: string}[]>('/owners/historical_orders', params);
  }

  public createABranch(params:string){
    return apiGetWithParams<{response : string}>('/owners/create_a_branch',params);
  }

  public aceptAnOrder(params:string){
    return apiGetWithParams<{response : string}>('/owners/acept_order',params);
  }

  public rejectAnOrder(params:string){
    return apiGetWithParams<{response : string}>('/owners/reject_order',params);
  }

  public startMakingAnOrder(params:string){
    return apiGetWithParams<{response : string}>('/owners/start_making_order',params);
  }

  public finaliceAnOrder(params:string){
    return apiGetWithParams<{response : string}>('/owners/finalize_order',params);
  }

}

@Injectable()
export class GeneralApiService{

  public getABranch(params : string) {
    return apiGetWithParams<BranchModel>('/api/obtain_a_branch', params);
  }

  public getRegisteredUsers() {
    return apiGet<UserModel[]>('/api/usuarios');
  }

  public getAUser(params : string) {
    return apiGetWithParams<UserModel>('/api/user/', params);
  }

}
