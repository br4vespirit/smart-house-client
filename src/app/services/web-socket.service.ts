import {inject, Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {MsalService} from "@azure/msal-angular";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  // private API_URL: string = "wss://smart-house-websocke-webapp.azurewebsites.net/";
  private API_URL: string = "wss://52.226.7.216:8000/";

  // @ts-ignore
  private socket$: WebSocketSubject<any>;

  constructor(private msalService: MsalService) {
  }

  initSocket(deviceName: string) {
    let token = "";
    this.msalService.acquireTokenSilent({
      scopes: [
        "https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.write",
        "https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.read",
      ],
      account: this.msalService.instance.getAllAccounts()[0]
    }).subscribe(data => {
      token = data.accessToken
      // console.log(token);
      let url = this.API_URL + "?device_name=" + deviceName + "&token=" + data.accessToken;
      console.log(url);
      this.socket$ = webSocket(url);
    });
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  public getMessage() {
    return this.socket$.asObservable();
  }
}
