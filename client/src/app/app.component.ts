import {Component, OnInit} from '@angular/core';
import {ClientsApiService, GeneralApiService, getAppInfo, OwnersApiService} from "./utils/api";
import {BranchModel, OrderModel, UserModel} from "./utils/objects.model";
import {Form} from "@angular/forms";
import {flush} from "@angular/core/testing";

@Component({
  selector: '[id=app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'Moorfy\'s test'

  branchesTableHeaders = ["branch_id","name", "latitude", "longitude", "number_of_tables", "email", "phone_number", "logo_url",
      "menu_url", "mode","owner_id"];
  ordersTableHeaders = ["order_id","branch_id", "user_id", "status", "content", "table_number", "timestamp"];
  usersTableHeaders = ["user_id", "first_name", "last_name", "password", "email", "isAdmin"];

  branchesList: BranchModel[] = [];
  registeredUsersList: UserModel[] = [];
  activeOrdersList: OrderModel[] = [];
  historicalOrdersList: OrderModel[] = [];

  // @ts-ignore
  private branchesListPro: { branches: BranchModel[] };
  // @ts-ignore
  private registeredUsersListPro: { users: UserModel[] };
  // @ts-ignore
  private activeOrdersListPro: { orders: string }[];
  // @ts-ignore
  private historicalOrdersListPro: { orders: string }[];
  // @ts-ignore
  private loggedUserPro : { user : UserModel};

  selectedBranchId : number = 1;
  // @ts-ignore
  selectedBranch : BranchModel;
  // @ts-ignore
  loggedUser : UserModel;
  orderContent : string = '';
  // @ts-ignore
  branchTableOrderId : number;

  constructor(private clientsApi: ClientsApiService, private ownersApi: OwnersApiService,
              private generalApi: GeneralApiService) {
  }

  async ngOnInit() {
    const info = await getAppInfo();
    this.title = info.name;

    await this.obtainBranchesLists();
    await this.obtainRegisteredUsersList();
    await this.obtainLoggedUser();

    await this.obtainActiveOrdersList();
    await this.obtainHistoricalOrdersList();


  }

  async placeOrder(f: Form){
    console.log("se envió el formulario");
    console.log(f);
    //# URL ejemplo: http://127.0.0.1:5000/clients/place_an_order?branch_id=1&table_id=2&user_id=3&order_content=Pido%20la%20promo%204
    const resultado = await this.clientsApi.placeAnOrder('?branch_id=' + this.selectedBranchId +
                        '&table_id=' + this.branchTableOrderId + '&user_id=' + this.loggedUser.id +
                        '&order_content=' + this.orderContent);
    console.log("se realizó el pedido");
    console.log(resultado);
  }

  async update(e: Event){
    // @ts-ignore
    this.selectedBranchId = e.target.value;
    await this.obtainActiveOrdersList();
    await this.obtainHistoricalOrdersList()
  }

  private async obtainSelectedBranch(){
    const branch = await this.generalApi.getABranch('?branch_id=' + this.selectedBranchId);
    this.selectedBranch = branch;
  }

  private async obtainLoggedUser() {
    const user = await this.generalApi.getAUser('1');
    this.loggedUserPro = {
      user: user
    }
    this.loggedUser = this.loggedUserPro.user;
  }

  private async obtainBranchesLists() {
    const branches = await this.clientsApi.getBranches2();
    this.branchesListPro = {
      branches: branches
    }
    this.branchesList = this.branchesListPro.branches;
    this.selectedBranch = this.branchesList[1];
  }

  private async obtainRegisteredUsersList() {
    const users = await this.generalApi.getRegisteredUsers();
    this.registeredUsersListPro = {
      users: users
    }
    this.registeredUsersList = this.registeredUsersListPro.users;
  }

  private async obtainActiveOrdersList2() {
    this.activeOrdersListPro = await this.ownersApi.getActiveOrders('?branch_id=' + this.selectedBranchId);
    this.activeOrdersList = [];
    for (let ii: number = 0; ii < this.activeOrdersListPro.length; ii++) {
      let unaOrdenString: { orders: string; } = this.activeOrdersListPro[ii];
      let unaOrden: OrderModel = this.fromStringToOrderModel(unaOrdenString);
      this.activeOrdersList.push(unaOrden);
    }
  }

  private async obtainActiveOrdersList() {
    this.activeOrdersListPro = await this.ownersApi.getActiveOrders('?branch_id=' + this.selectedBranchId);
    this.activeOrdersList = [];
    for (let ii: number = 0; ii < this.activeOrdersListPro.length; ii++) {
      let unaOrdenString: { orders: string; } = this.activeOrdersListPro[ii];
      let unaOrden: OrderModel = this.fromStringToOrderModel(unaOrdenString);
      this.activeOrdersList.push(unaOrden);
    }
  }

  private async obtainHistoricalOrdersList() {
    this.historicalOrdersListPro = await this.ownersApi.getHistoricalOrders('?branch_id=' + this.selectedBranchId);
    this.historicalOrdersList = [];
    for (let ii: number = 0; ii < this.historicalOrdersListPro.length; ii++) {
      let unaOrdenString: { orders: string; } = this.historicalOrdersListPro[ii];
      let unaOrden: OrderModel = this.fromStringToOrderModel(unaOrdenString);
      this.historicalOrdersList.push(unaOrden);
    }
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
