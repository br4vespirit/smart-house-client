import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Device} from "../models/device.model";
import {Observable} from "rxjs";
import {HistoricalRequest} from "../models/historical-request.model";

@Injectable({
  providedIn: 'root'
})
export class HistoricalService {

  // private API_URL: string = "https://smart-house-api.azurewebsites.net/";
  private API_URL: string = "https://smart-house-historical-data-function-app.azurewebsites.net/";
  // private API_URL: string = "http://localhost:8000/";

  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
    "x-functions-key": "5_4JosOUJLyWG1Lm3G1CfNmbSG5H2yTiwe3ewWK6y0KsAzFuqoBnig=="
  })

  constructor(private _client: HttpClient) { }

  public fetchHistoricalData(request: HistoricalRequest): Observable<any> {
    return this._client.post(
        this.API_URL + "api/v1/smart-house/historical-data",
        request,
        {headers: this.headers}
    );
  }
}
