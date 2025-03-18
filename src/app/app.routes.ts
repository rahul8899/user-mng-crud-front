import { Routes } from '@angular/router';
import { LoginComponent } from './module/login/login.component';
import { authGuard } from './auth.guard';
import { NotFoundComponent } from './module/not-found/not-found.component';
import { SignupComponent } from './module/signup/signup.component';
import { CategoryComponent } from './module/category/category.component';

export const routes: Routes = [

    { path: '', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'category', component: CategoryComponent, canActivate: [authGuard] },
];
