import {Injectable} from "@angular/core";
import {BranchModel} from "./objects.model";

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

  const urlBase = 'http://localhost:5000';
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

  const urlBase = 'http://localhost:5000';
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

// Para probar 2
@Injectable()
export class ClientsApiService{

  public getBranches() {
    return apiGet<{branches: string}[]>('/clients/branches');
  }

}
// Para probar 2
@Injectable()
export class OwnersApiService{

  public getActiveOrders(params : string) {
    return apiGetWithParams<{orders: string}[]>('/owners/active_orders', params);
  }

  public getHistoricalOrders(params : string) {
    return apiGetWithParams<{orders: string}[]>('/owners/historical_orders', params);
  }

}
