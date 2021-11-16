import {Component, OnInit} from '@angular/core';
import {ClientsApiService, getAppInfo} from "./utils/api";
import {BranchModel} from "./utils/objects.model";

@Component({
  selector: '[id=app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'Moorfy\'s test'

  branchesList: BranchModel[] = [new BranchModel(
         'prueba branchito',
     35.555555,
     45.22222,
     20,
     'mail@testdomain.com',
     45741111,
     'https://j2logo.com/wp-content/uploads/gunicorn-request.jpg',
     'https://j2logo.com/tutorial-flask-leccion-17-desplegar-flask-produccion-nginx-gunicorn/',
     1
  )];

  private branchesListPro: { branches: BranchModel[]; } | undefined;

  constructor(private clientsApi: ClientsApiService) {
  }

  async ngOnInit() {
    const info = await getAppInfo();
    this.title = info.name;
    const branches = await this.clientsApi.getBranches();
    this.branchesListPro = {
      branches: branches
    }
    console.log(this.branchesListPro);
    this.branchesList = this.branchesListPro.branches;
    console.log(this.branchesList?.length ?? 0);
  }


}
