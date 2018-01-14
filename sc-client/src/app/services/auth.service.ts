import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';

@Injectable()
export class AuthService {
  public clientID = 'ffo29j7yKM850v1LcXyz9EoF61ozrkFE';
  public domain = 'sharecode.auth0.com';
  public responseType = 'token id_token';
  public audience = 'https://sharecode.auth0.com/userinfo';
  public redirectUri = 'http://45.78.60.183:3000/';
  public scope = 'openid profile';

  auth0 = new auth0.WebAuth({
    clientID: this.clientID,
    domain: this.domain,
    responseType: this.responseType,
    audience: this.audience,
    redirectUri: this.redirectUri,
    scope: this.scope
  });

  constructor(public router: Router, private http: Http) {}

  public login(): void {
    // store current url to localStorage for redirection after login
    this.saveCurrentLoginUrl()
      .then(() => {
        this.auth0.authorize();
      });
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        // read the login url, and jump back to the same page after login
        this.router.navigate([localStorage.getItem('login_url')]);
        // reload page to get username
        window.location.reload();
      } else if (err) {
        this.router.navigate(['/problems']);
        console.log(err);
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    localStorage.removeItem('login_url');

    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public getUserProfile() {
    return JSON.parse(localStorage.getItem('profile'));
  }

  public resetPassword(email: string): void {
    const client_id: string = this.clientID;
    const url = `https://${this.domain}/dbconnections/change_password`;
    const headers = new Headers({'content-type': 'application/json'});

    const body = {
      'client_id': client_id,
      'email': email,
      'connection': 'Username-Password-Authentication'
    };

    console.log(url);
    console.log(body);

    this.http.post(url, body, headers)
      .toPromise()
      .then((res: Response) => {
        console.log(res);
      })
      .catch(this.handleError);
  }

  public saveUserProfile(): Promise<Object> {
    return new Promise((resolve, reject) => {
      const local_profile = JSON.parse(localStorage.getItem('profile'));
      if (local_profile) {
        resolve(local_profile);
      }

      // localStorage do not have user profile, try to
      // fetch user profile from remote server
      const access_token = localStorage.getItem('access_token');
      // cannot file access_token
      if ( !access_token ) {
        reject('[saveUserProfile]: Access token must exist to fetch profile!');
      }
      // fetch user profile
      this.auth0.client.userInfo(access_token, (err, profile) => {
        if (profile) {
          localStorage.setItem('profile', JSON.stringify(profile));
          resolve(profile);
        } else {
          reject('[saveUserProfile]: Cannot fetch profile from remote');
        }
      });
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  // store current url to localStorage for redirection after login
  private saveCurrentLoginUrl(): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem('login_url', this.router.url);
      resolve();
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.body || error);
  }
}
