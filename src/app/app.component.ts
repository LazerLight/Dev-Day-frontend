import { Component, OnInit } from "@angular/core";
import { UserService } from "./api/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  
  title = "app";
  brandLogo: string;

  constructor(
    public userInstance: UserService,
    private resThing: Router
  ) {
    this.brandLogo = 'assets/images/favicon.png' 

  }

  ngOnInit() {
    this.userInstance.check().catch(err => {
      console.log("App login check error");
      console.log(err);
    });
  }

  logoutClick() {
    this.userInstance.logout()
    .then(() => {
      this.resThing.navigateByUrl( "/" );
    })
    .catch(err => {
      console.log("App logout error");
      console.log(err);
    });
  }
}
