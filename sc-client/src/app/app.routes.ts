import { Routes, RouterModule } from '@angular/router';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    // root
    path: '',
    redirectTo: 'problems',
    pathMatch: 'full'
  },
  {
    path: 'problems',
    component: ProblemListComponent
  },
  {
    path: 'problems/:id',
    component: ProblemDetailComponent
  },
  {
    path: 'profile',
    canActivate: ['navGuard'],
    component: ProfileComponent
  },
  {
    // any other addr
    path: '**',
    redirectTo: 'problems'
  }
];

// other component will use RouterModule (not Routes)
export const routing = RouterModule.forRoot(routes);
