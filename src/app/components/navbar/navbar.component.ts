import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
  AuthenticationResult,
  InteractionStatus,
  InteractionType,
  PopupRequest,
  RedirectRequest
} from "@azure/msal-browser";
import {filter, Subject, takeUntil} from "rxjs";
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {IsLoggedInService} from "../../services/is-logged-in.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;
  private readonly _destroy = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
              private msalBroadCastService: MsalBroadcastService,
              private authService: MsalService,
              private isLoggedInService: IsLoggedInService) {
  }

  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe(data => {
      if (data != null) {
        localStorage.setItem("access_token", data.accessToken);
      }
    });
    this.msalBroadCastService.inProgress$.pipe(
      filter((interactionStatus: InteractionStatus) => interactionStatus == InteractionStatus.None),
      takeUntil(this._destroy)
    )
      .subscribe(x => {
        this.isUserLoggedIn = this.authService.instance.getAllAccounts().length > 0
        this.isLoggedInService.isUserLoggedIn.next(this.isUserLoggedIn);
      })
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({...this.msalGuardConfig.authRequest, ...userFlowRequest} as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup(userFlowRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest, ...userFlowRequest} as RedirectRequest);
      } else {
        this.authService.loginRedirect(userFlowRequest);
      }
    }
  }

  logout() {
    this.authService.logoutRedirect({postLogoutRedirectUri: "http://localhost:4200"})
  }
}
