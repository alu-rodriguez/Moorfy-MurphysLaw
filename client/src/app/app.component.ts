import {Component, OnInit} from '@angular/core';
import {getAppInfo} from "./utils/api";

@Component({
  selector: '[id=app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'Nico\'s test'

  async ngOnInit() {
    const info = await getAppInfo();
    this.title = info.name;
  }
}
