import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ScriptRequest} from "../models/script-request.model";

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  private API_URL: string = "https://smart-house-code-generation-function-app.azurewebsites.net/api/v1/smart-house/";

  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
    "x-functions-key": "ARXfKaCJAjCG_7RzLigveHXqEk1gIYmkiecRw-T8gjcuAzFumjlGbg=="
  })

  constructor(private _client: HttpClient) { }

  public generateScript(request: ScriptRequest): Observable<any> {
    return this._client.post<any>(
      this.API_URL + "generate-code",  // Endpoint changed to /code
      request,
      { responseType: 'blob' as 'json', headers: this.headers } // Set responseType to blob
    )
  }
}
