import {Component, OnInit} from '@angular/core';
import {ClientsApiService, GeneralApiService, getAppInfo, OwnersApiService, SharedAppsApiService} from "./utils/api";
import {BranchModel, OrderModel, UserModel} from "./utils/objects.model";
import {Form, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: '[id=app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'Moorfy\'s test'

  branchesTableHeaders = ["appId", "branch_id","name", "latitude", "longitude", "number_of_tables", "email", "phone_number", "logo_url",
      "menu_url", "mode","owner_id"];
  ordersTableHeaders = ["order_id","branch_id", "user_id", "status", "content", "table_number", "timestamp"];
  usersTableHeaders = ["user_id", "first_name", "last_name", "password", "email", "isAdmin"];
  orderActions = ['Aceptar','Rechazar','Iniciar', 'Finalizar']

  branchesList: BranchModel[] = [];
  registeredUsersList: UserModel[] = [];
  activeOrdersList: OrderModel[] = [];
  historicalOrdersList: OrderModel[] = [];
  private appsListMap: { [appId: number]: string }[] =  [{1:'ver-la-carta'}, {2: 'arquiweb-tp1'}, {3: 'moorfy'}];
  private appsMap: { [appId: number]: string } = {1:'ver-la-carta', 2: 'arquiweb-tp1', 3: 'moorfy'};
  appsList: string[] = [];

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

  selectedBranchId : number = 0;
  selectedOrderId : number = 0;
  selectedOrderAction : string = '';
  // @ts-ignore
  selectedBranch : BranchModel;
  selectedUserId : string = '';
  // @ts-ignore
  selectedUser : UserModel;
  selectedApp : string = '';
  selectedAppBranches : BranchModel[] = [];

  loggedUserId : string = '';
  // @ts-ignore
  loggedUser : UserModel;

  branchTableOrderId : number = 0;
  orderContent : string = '';

  constructor(private clientsApi: ClientsApiService, private ownersApi: OwnersApiService,
    private generalApi: GeneralApiService, private sharedApi: SharedAppsApiService) {

      this.selectedOrderAction = this.orderActions[0];
      this.loggedUserId = "3";
      this.obtainApps();

      this.ngOnInit();
  }

  private obtainApps() {
    this.appsList = [];
    for(let i = 0; i < this.appsListMap.length; i++){
      this.appsList.push(this.appsListMap[i][i+1]);
    }
    this.selectedApp = this.appsList[0];
  }

  // @ts-ignore
  placeOrderForm: FormGroup;

  async ngOnInit() {
    const info = await getAppInfo();
    this.title = info.name;

    await this.obtainUsers();
    await this.obtainBranches();
    await this.obtainOrders();
    await this.obtainHistoricalOrders();
    await this.obtainLoggedUser(this.loggedUserId);

    this.placeOrderForm = new FormGroup({
      userName: new FormControl()
    });
  }

  async placeOrder(f: Form){
    console.log("se envió el formulario de realizar pedido");
    console.log(f);
    const resultado = await this.sharedApi.placeAnOrder(this.selectedBranch, this.branchTableOrderId, this.selectedUser, this.orderContent);
    console.log("se realizó el pedido");
    console.log(resultado);
  }

  async changeStatusOrder(f: Form){
    console.log("se envió el formulario de aceptar orden");
    console.log(f);
    let resultado;
    if(this.selectedOrderAction = 'Aceptar') {
      console.log("se procede a aceptar la orden");
      //# Ejemplo url: http://127.0.0.1:5000/owners/acept_order?order_id=1
      resultado = await this.ownersApi.aceptAnOrder('?order_id=' + this.selectedOrderId );
    } else if (this.selectedOrderAction = 'Rechazar'){
      resultado = await this.ownersApi.rejectAnOrder('?order_id=' + this.selectedOrderId );
    } else if (this.selectedOrderAction = 'Iniciar'){
      resultado = await this.ownersApi.startMakingAnOrder('?order_id=' + this.selectedOrderId );
    } else if (this.selectedOrderAction = 'Finalizar'){
      resultado = await this.ownersApi.finaliceAnOrder('?order_id=' + this.selectedOrderId );
    } else {
      resultado = {'error': 'no se seleccionó una opción correcta'};
    }
    console.log("terminó el llamado y el resultado fue: ");
    console.log(resultado);
  }

  //async update(e: Event){
    // @ts-ignore
  //  this.selectedBranchId = e.target.value;
  //  await this.obtainActiveOrdersList();
  //  await this.obtainHistoricalOrdersList()
  //}

  async updateSelectedOrder(e: Event){
    // @ts-ignore
    this.selectedOrderId = e.target.value;
  }

  async updateSelectedOrderAction(e: Event){
    console.log('se cambio la seleccion de orden');
    // @ts-ignore
    console.log(e.target.value);
    // @ts-ignore
    this.selectedOrderAction = e.target.value;
  }

  public async updateSelectedBranch(e: Event){
    // @ts-ignore
    this.selectedBranchId = e.target.value;
    //const branch = await this.generalApi.getABranch('?branch_id=' + this.selectedBranchId);
    let notFound = true;
    let i = 0;
    while(notFound && i < this.selectedAppBranches.length){
      let branch = this.selectedAppBranches[i];
      if(this.appsMap[branch.appId] == this.selectedApp && branch.branch_id == this.selectedBranchId){
        this.selectedBranch = branch;
        notFound = false;
      }
      i++;
    }
  }

  private async obtainLoggedUser(userId: string) {
    const user = await this.generalApi.getAUser(userId);
    this.loggedUserPro = {
      user: user
    }
    this.loggedUser = this.loggedUserPro.user;
  }

  public async updateSelectedUser(e: Event) {
    // @ts-ignore
    this.selectedUserId = e.target.value;
    const user = await this.generalApi.getAUser(this.selectedUserId);
    this.loggedUserPro = {
      user: user
    }
    this.selectedUser = this.loggedUserPro.user;
  }

  public updateSelectedApp(e: Event) {
    // @ts-ignore
    let newSelectedApp = e.target.value;
    if (this.selectedApp != newSelectedApp) {
      this.selectedApp = newSelectedApp;
      this.updateSelectedAppBranches();
    }
  }

  private updateSelectedAppBranches() {
    this.selectedAppBranches = [];
    for(let i = 0; i < this.branchesList.length; i++){
      let branchAppId = this.branchesList[i].appId;
      let branchAppName = this.appsMap[branchAppId];
      if(branchAppName == this.selectedApp){
        this.selectedAppBranches.push(this.branchesList[i]);
      }
    }
    this.selectedBranch = this.selectedAppBranches[0];
    this.selectedBranchId = this.selectedBranch.appId;
  }

  private async obtainBranches() {
    const branches = await this.sharedApi.getBranches();
    this.branchesListPro = {
      branches: branches
    }
    this.branchesList = this.branchesListPro.branches;
    this.updateSelectedAppBranches();
  }

  private async obtainUsers() {
    const users = await this.generalApi.getRegisteredUsers();
    this.registeredUsersListPro = {
      users: users
    }
    this.registeredUsersList = this.registeredUsersListPro.users;
    this.selectedUser = this.registeredUsersList[0];
    this.selectedUserId = this.selectedUser.id.toString();
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

  private async obtainOrders() {
    this.activeOrdersListPro = await this.ownersApi.getActiveOrders('?branch_id=' + this.selectedBranchId);
    this.activeOrdersList = [];
    for (let ii: number = 0; ii < this.activeOrdersListPro.length; ii++) {
      let unaOrdenString: { orders: string; } = this.activeOrdersListPro[ii];
      let unaOrden: OrderModel = this.fromStringToOrderModel(unaOrdenString);
      this.activeOrdersList.push(unaOrden);
    }
    this.selectedOrderId = this.activeOrdersList[0].order_id;
  }

  private async obtainHistoricalOrders() {
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
