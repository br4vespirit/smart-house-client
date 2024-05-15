import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Device} from "../models/device.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private API_URL: string = "https://api-smart-house-iot.azurewebsites.net/api/";
  // private API_URL: string = "http://localhost:8000/";

  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  })

  constructor(private _client: HttpClient) { }

  public createDevice(request: Device): Observable<any> {
    return this._client.post<any>(
      this.API_URL + "devices",
      request,
      {headers: this.headers}
    )
  }

  public fetchDevices(): Observable<any> {
    return this._client.get(this.API_URL + "devices",
      {headers: this.headers})
  }

  public deleteDevice(deviceName: string): Observable<any> {
    return this._client.delete(this.API_URL + "v1/smart-house/devices?name=" + deviceName,
      {headers: this.headers})
  }

  public updateDevice(deviceName: string, device: Device): Observable<any> {
    console.log(device);
    return this._client.put(this.API_URL + "v1/smart-house/devices?name=" + deviceName,
      device,
      {headers: this.headers});
  }
}
