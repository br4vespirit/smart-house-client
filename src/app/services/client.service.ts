import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private API_URL: string = "http://localhost:8000/";

  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  })

  constructor(private _client: HttpClient) { }

  public createDevice(request: string): Observable<any> {
    return this._client.post<any>(
      this.API_URL + "v1/users/811ec8ca-79f8-4204-b819-177483450959/devices",
      request,
      {headers: this.headers}
    )
  }

  public fetchDevices(): Observable<any> {
    return this._client.get(this.API_URL + "/v1/users/811ec8ca-79f8-4204-b819-177483450959/devices",
      {headers: this.headers})
  }
}
