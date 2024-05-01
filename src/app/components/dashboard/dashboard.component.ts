import {Component, OnDestroy, OnInit} from '@angular/core';
import {Device} from "../../models/device.model";
import {ClientService} from "../../services/client.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateDeviceModalComponent} from "./create-device-modal/create-device-modal.component";
import {firstValueFrom, Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  devices: Device[] = [];

  fetchAllDevicesSubscription: Subscription = new Subscription();
  createDeviceSubscription: Subscription = new Subscription();

  constructor(private _client: ClientService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchAllDevicesSubscription = this._client.fetchDevices().subscribe(
      data => {
        this.devices = data;
      }
    )
  }

  ngOnDestroy(): void {
    this.fetchAllDevicesSubscription.unsubscribe();
    this.createDeviceSubscription.unsubscribe();
  }

  async openModal(): Promise<string> {
    const dialogRef = this.dialog.open(CreateDeviceModalComponent, {
      width: '400px'
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  async createDevice() {
    const deviceName = await this.openModal();
    if (deviceName.length != undefined) {
      const newDevice= new Device(deviceName);
      this.createDeviceSubscription = this._client.createDevice(newDevice).subscribe({
        complete: () => this.devices.push(newDevice),
        error: err => console.error('Error creating device: ', err)
      })
    }
  }
}
