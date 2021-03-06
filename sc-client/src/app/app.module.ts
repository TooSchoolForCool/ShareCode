import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// routing info
import { routing } from './app.routes';

// components
import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditorComponent } from './components/editor/editor.component';

// services
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { NavGuardService } from './services/nav-guard.service';
import { CollaborationService } from './services/collaboration.service';


@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NewProblemComponent,
    NavbarComponent,
    ProfileComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [{
    provide: 'data',
    useClass: DataService
  }, {
    provide: 'auth0',
    useClass: AuthService
  }, {
    provide: 'navGuard',
    useClass: NavGuardService
  }, {
    provide: 'collaboration',
    useClass: CollaborationService
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
