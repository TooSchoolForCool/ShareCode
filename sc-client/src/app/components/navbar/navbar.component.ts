import { Component, OnInit, Inject } from '@angular/core';
import {type} from 'os';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public title = 'ShareCode';
  public username = '';

  constructor(@Inject('auth0') private auth) { }

  public ngOnInit() {
    if ( this.auth.isAuthenticated() ) {
      this.auth.getUserProfile()
        .then(profile => {
          console.log(profile.prototype);
          this.username = profile.nickname;
        })
        .catch(msg => console.log(msg));
    }
  }

  public login(): void {
    this.auth.login();
  }

  public logout(): void {
    this.auth.logout();
  }
}
