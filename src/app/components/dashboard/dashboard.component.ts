import {Component, OnDestroy, OnInit} from '@angular/core';
import {Device} from "../../models/device.model";
import {ClientService} from "../../services/client.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  devices: Device[] = [];

  constructor(private _client: ClientService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  perform(): void {
    this._client.fetchDevices().subscribe();
  }
}
