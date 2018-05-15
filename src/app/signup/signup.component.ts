import { Component, OnInit } from "@angular/core";
import { SignupCredentials, UserService } from "../api/user.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment.prod";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {

  formCreds: SignupCredentials = new SignupCredentials();
  environment = environment
  constructor(
    public userInstance: UserService,
    private resInstance: Router
  ) { 

  }

  ngOnInit() {}
  signupSubmit() {
    this.userInstance
      .postSignup(this.formCreds)
      .then(result => {
        this.resInstance.navigateByUrl("/projects");
      })
      .catch(err => {
        console.log("signup error");
        console.log(err);
      });
  }
}
