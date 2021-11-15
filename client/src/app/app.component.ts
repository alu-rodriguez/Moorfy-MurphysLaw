import {Component, OnInit} from '@angular/core';
import {ClientsApiService, getAppInfo} from "./utils/api";
import {Branches} from "./utils/branches.model";

@Component({
  selector: '[id=app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'Nico\'s test'

  branchesList: Branches[] = [];

  constructor(private clientsApi: ClientsApiService){
  }

  async ngOnInit() {
    const info = await getAppInfo();
    this.title = info.name;
    let branchesListCla = await this.clientsApi.getBranches();
    this.branchesList = branchesListCla.branches;
  }

}
