import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { UserService } from "./api/user.service";
import { NotFoundComponent } from "./not-found/not-found.component";
import { LoginComponent } from "./login/login.component";
import { HomePageComponent } from './home-page/home-page.component';
import { SignupComponent } from './signup/signup.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { OneProjectComponent } from './one-project/one-project.component';
import { ProjectService } from "./api/project.service";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginComponent,
    HomePageComponent,
    SignupComponent,
    ProjectsPageComponent,
    OneProjectComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule],
  providers: [
    UserService,
    ProjectService],
  bootstrap: [AppComponent]
})
export class AppModule {}
