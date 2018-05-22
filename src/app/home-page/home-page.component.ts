import { Component, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"]
})
export class HomePageComponent implements OnInit {
  devDayLogo: string;
  githubLogo: string;
  githubUrl: string;
  bgHome: string;
  focusIcon: string;
  testLogo: string;

  constructor() {
    this.devDayLogo = "assets/images/verticalLogoDark.png";
    this.githubLogo = "assets/images/github-logo-white.png";
    this.githubUrl = `${environment.backUrl}/api/github/login`;
    this.bgHome = "assets/images/bg-home.jpg";
    this.focusIcon = "assets/images/focus-icon.png";
    this.testLogo = "assets/images/clickable-logo.png";
  }

  ngOnInit() {
    $(document).ready(function() {
      $(".parallax").parallax();
    });
  }
}
