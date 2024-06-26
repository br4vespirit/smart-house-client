import {BrowserCacheLocation, LogLevel} from "@azure/msal-browser";

const isIE = window.navigator.userAgent.indexOf('MSIE') > -1
  || window.navigator.userAgent.indexOf('Trident/') > -1

export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_SignUpSignIn',
    editProfile: 'B2C_1_ProfileEdit',
    passwordReset: 'B2C_1_PasswordReset',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://smarthouseadb2c.b2clogin.com/smarthouseadb2c.onmicrosoft.com/B2C_1_SignUpSignIn',
    },
    editProfile: {
      authority:
        'https://smarthouseadb2c.b2clogin.com/smarthouseadb2c.onmicrosoft.com/B2C_1_ProfileEdit',
    },
    passwordReset: {
      authority:
        'https://smarthouseadb2c.b2clogin.com/smarthouseadb2c.onmicrosoft.com/B2C_1_PasswordReset',
    }
  },
  authorityDomain: 'smarthouseadb2c.b2clogin.com',
};

export const configuration = {
  auth: {
    clientId: '306a80d0-abe2-46f6-aac5-d91c7c12ef98',
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: 'https://smart-house.azurewebsites.net',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
}
