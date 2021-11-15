import {Injectable} from "@angular/core";
import {BranchModel} from "./objects.model";

enum HttpMethod {
  Get = 'GET'
}

interface ApiFetchArguments {
  method: HttpMethod,
  path: string,
}

const apiFetch = <T>({method, path}: ApiFetchArguments) => {
  const options: RequestInit = {
    method: method,
  };

  return fetch(path, options)
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

const apiGet = <T>(path: string) => {
  return fetchAndParseResponse<T>({
    method: HttpMethod.Get,
    path
  });
}

// Para probar
export const getAppInfo = () => {
  return apiGet<{name: string}>('/api/app-info');
}

// Para probar 2
@Injectable()
export class ClientsApiService{

  public getBranches(): Promise<{ branches: BranchModel[] }> {
    return apiGet<{branches: BranchModel[]}>('/clients/branches');
  }

}
