import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { SignupComponent } from "./signup/signup.component";
import { ProjectsPageComponent } from "./projects-page/projects-page.component";
import { OneProjectComponent } from "./one-project/one-project.component";
import { AboutPageComponent } from "./about-page/about-page.component";
import { ContactPageComponent } from "./contact-page/contact-page.component";
import { RouteGuardService } from "./route-guard.service";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "about", component: AboutPageComponent },
  { path: "contact", component: ContactPageComponent },
  { path: "", canActivate: [ RouteGuardService ], children:[
    { path: "projects", component: ProjectsPageComponent },
    { path: "project/:projectId", component: OneProjectComponent },
  ]},

  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
