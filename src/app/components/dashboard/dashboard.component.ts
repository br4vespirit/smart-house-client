import {Component, OnDestroy, OnInit} from '@angular/core';
import {Device} from "../../models/device.model";
import {ClientService} from "../../services/client.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateDeviceModalComponent} from "./create-device-modal/create-device-modal.component";
import {firstValueFrom, Subscription} from "rxjs";
import {SubmitFormComponent} from "../utils/submit-form/submit-form.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  devices: Device[] = [];

  fetchAllDevicesSubscription: Subscription = new Subscription();
  createDeviceSubscription: Subscription = new Subscription();
  deleteDeviceSubscription: Subscription = new Subscription();
  updateDeviceSubscription: Subscription = new Subscription();

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
    this.deleteDeviceSubscription.unsubscribe();
    this.updateDeviceSubscription.unsubscribe();
  }

  async openModal(): Promise<Device | boolean> {
    const dialogRef = this.dialog.open(CreateDeviceModalComponent, {
      width: '800px'
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  async createDevice() {
    const result = await this.openModal();
    if (result !== false) {
      let device = result as Device;
      this.createDeviceSubscription = this._client.createDevice(device).subscribe({
        next: (data) => {
          let d = device as Device;
          d.connection_string = data.connection_string
          this.devices.push(d);
        },
        error: err => console.error('Error creating device: ', err)
      })
    }
  }

  async deleteDevice(deviceName: string) {
    const result = await this.openDeleteModal();
    if (result) {
      this.deleteDeviceSubscription = this._client.deleteDevice(deviceName).subscribe({
        next: () => {
          this.removeDeviceWithName(deviceName);
        }
      });
    }
  }

  async openDeleteModal(): Promise<boolean> {
    const dialogRef = this.dialog.open(SubmitFormComponent, {
      width: '400px'
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  removeDeviceWithName(name: string): void {
    this.devices = this.devices.filter(device => device.name !== name);
  }
}
