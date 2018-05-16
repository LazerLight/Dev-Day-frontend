import { Component, OnInit } from "@angular/core";
import { LoginCredentials, UserService } from "../api/user.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  formCreds: LoginCredentials = new LoginCredentials();
  logo: string;
  githubUrl: string;



  constructor(public userInstance: UserService, private resInstance: Router) {
    this.logo = 'assets/images/verticalLogoLight.png'
    this.githubUrl = `${environment.backUrl}/api/github/login`
  }
  
  ngOnInit() {}

  loginSubmit() {
    this.userInstance
      .postLogin(this.formCreds)
      .then(result => {
        this.resInstance.navigateByUrl("/boards");
      })
      .catch(err => {
        console.log("login error");
        console.log(err);
      });
  }
}
