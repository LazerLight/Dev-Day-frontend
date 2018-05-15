import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { UserService } from "./api/user.service";
import { NotFoundComponent } from "./not-found/not-found.component";
import { LoginComponent } from "./login/login.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { SignupComponent } from "./signup/signup.component";
import { ProjectsPageComponent } from "./projects-page/projects-page.component";
import { OneProjectComponent } from "./one-project/one-project.component";
import { ProjectService } from "./api/project.service";
import { AboutPageComponent } from "./about-page/about-page.component";
import { ContactPageComponent } from "./contact-page/contact-page.component";
import { MaterializeModule } from "./app-materialize.module";
import { BotFormComponent } from "./bot-form/bot-form.component";
import { GithubApiService } from "./api/github-api.service";
import { RouteGuardService } from "./api/route-guard.service";
import { IsContributorPipe } from "./pipes-folder/is-contributor.pipe";
import { TrelloService } from "./api/trello.service";
import { CardService } from "./api/card.service";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginComponent,
    HomePageComponent,
    SignupComponent,
    ProjectsPageComponent,
    OneProjectComponent,
    AboutPageComponent,
    ContactPageComponent,
    BotFormComponent,
    IsContributorPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MaterializeModule
  ],
<<<<<<< HEAD
  providers: [UserService, ProjectService, RouteGuardService, GithubApiService, TrelloService],
=======
  providers: [
    UserService,
    ProjectService,
    RouteGuardService,
    GithubApiService,
    CardService
  ],
>>>>>>> 07a8a47d99348e0e0b7b9b11a8506722a4cc8539
  bootstrap: [AppComponent]
})
export class AppModule {}
