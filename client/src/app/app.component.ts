import {Component, OnInit} from '@angular/core';
import {ClientsApiService, getAppInfo, OwnersApiService} from "./utils/api";
import {BranchModel, OrderModel} from "./utils/objects.model";

@Component({
  selector: '[id=app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'Moorfy\'s test'

  branchesTableHeaders = ["order_id","name", "latitude", "longitude", "number_of_tables", "email", "phone_number", "logo_url",
      "menu_url", "mode", "owner_id"];
  ordersTableHeaders = ["name", "latitude", "longitude", "number_of_tables", "email", "phone_number", "logo_url",
      "menu_url", "mode"];
  usersTableHeaders = ["id", "first_name", "last_name", "password", "email", "isAdmin"];

  branchesList: BranchModel[] = [];
  activeOrdersList: OrderModel[] = [];
  historicalOrdersList: OrderModel[] = [];

  // @ts-ignore
  private branchesListPro: { branches: string }[];
  // @ts-ignore
  private activeOrdersListPro: { orders: string }[];
  // @ts-ignore
  private historicalOrdersListPro: { orders: string }[];

  constructor(private clientsApi: ClientsApiService, private ownersApi: OwnersApiService) {
  }

  async ngOnInit() {
    const info = await getAppInfo();
    this.title = info.name;

    await this.obtainBranchesLists();
    await this.obtainActiveOrdersList();
    await this.obtainHistoricalOrdersList();
    
    const branches = await this.clientsApi.getBranches2();
    this.branchesListPro = {
      branches: branches
    }
    console.log(this.branchesListPro);
    this.branchesList = this.branchesListPro.branches;
    console.log(this.branchesList?.length ?? 0);
  }

  private async obtainBranchesLists() {
    this.branchesListPro = await this.clientsApi.getBranches();
    //console.log(this.branchesListPro);
    // @ts-ignore
    //console.log(this.branchesListPro[1]);
    this.branchesList = [];
    for (let ii: number = 0; ii < this.branchesListPro.length; ii++) {
      let unaSucursalString: { branches: string; } = this.branchesListPro[ii];
      let unaSucursal: BranchModel = this.fromStringToBranchModel(unaSucursalString);
      this.branchesList.push(unaSucursal);
    }
    console.log(this.branchesList);
  }

  private async obtainActiveOrdersList() {
    this.activeOrdersListPro = await this.ownersApi.getActiveOrders('?branch_id=1');
    //console.log(this.activeOrdersListPro);
    // @ts-ignore
    //console.log(this.activeOrdersListPro[1]);
    this.activeOrdersList = [];
    for (let ii: number = 0; ii < this.activeOrdersListPro.length; ii++) {
      let unaOrdenString: { orders: string; } = this.activeOrdersListPro[ii];
      let unaOrden: OrderModel = this.fromStringToOrderModel(unaOrdenString);
      this.activeOrdersList.push(unaOrden);
    }
    console.log(this.activeOrdersList);
  }

  private async obtainHistoricalOrdersList() {
    this.historicalOrdersListPro = await this.ownersApi.getHistoricalOrders('?branch_id=1');
    console.log(this.historicalOrdersListPro);
    // @ts-ignore
    console.log(this.historicalOrdersListPro[1]);
    this.historicalOrdersList = [];
    for (let ii: number = 0; ii < this.historicalOrdersListPro.length; ii++) {
      let unaOrdenString: { orders: string; } = this.historicalOrdersListPro[ii];
      let unaOrden: OrderModel = this.fromStringToOrderModel(unaOrdenString);
      this.historicalOrdersList.push(unaOrden);
    }
    console.log(this.historicalOrdersList);
  }

  protected fromStringToBranchModel (unaSucursalString: { branches: string; }) {
    let // @ts-ignore
      branch_id : number = unaSucursalString.branch_id;
    let // @ts-ignore
      nombre : string = unaSucursalString.name;
    let // @ts-ignore
      latitude : number = unaSucursalString.latitude;
    let // @ts-ignore
      longitude : number = unaSucursalString.longitude;
    let // @ts-ignore
      number_of_tables : number = unaSucursalString.number_of_tables;
    let // @ts-ignore
      email : string = unaSucursalString.email;
    let // @ts-ignore
      phone_number : number = unaSucursalString.phone_number;
    let // @ts-ignore
      logo_url : string = unaSucursalString.logo_url;
    let // @ts-ignore
      menu_url : string = unaSucursalString.menu_url;
    let // @ts-ignore
      mode : number = unaSucursalString.mode;
    let // @ts-ignore
      owner_id : number = unaSucursalString.owner_id;
    return new BranchModel(branch_id, nombre, latitude, longitude, number_of_tables, email, phone_number, logo_url,
      menu_url, mode, owner_id);
  }

  protected fromStringToOrderModel (unaOrdenString: { orders: string; }) {
    let // @ts-ignore
      order_id : number = unaOrdenString.order_id;
    let // @ts-ignore
      branch_id : number = unaOrdenString.branch_id;
    let // @ts-ignore
      user_id : number = unaOrdenString.user_id;
    let // @ts-ignore
      status : string = unaOrdenString.status;
    let // @ts-ignore
      content : string = unaOrdenString.content;
    let // @ts-ignore
      table_number : number = unaOrdenString.table_number;
    let // @ts-ignore
      timestamp : string = unaOrdenString.timestamp;
    return new OrderModel(order_id, branch_id, user_id, status, content, table_number, timestamp);
  }
}
