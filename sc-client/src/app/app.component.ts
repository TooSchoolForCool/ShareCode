import {Component, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ShareCode';

  constructor(@Inject('auth0') private auth) {
    auth.handleAuthentication();
  }
}
