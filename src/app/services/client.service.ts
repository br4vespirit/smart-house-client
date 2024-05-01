import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Device} from "../models/device.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private API_URL: string = "https://smart-house-api.azurewebsites.net/";
  // private API_URL: string = "http://localhost:8000/";

  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  })

  constructor(private _client: HttpClient) { }

  public createDevice(request: Device): Observable<any> {
    return this._client.post<any>(
      this.API_URL + "api/v1/devices",
      request,
      {headers: this.headers}
    )
  }

  public fetchDevices(): Observable<any> {
    return this._client.get(this.API_URL + "api/v1/devices",
      {headers: this.headers})
  }
}
