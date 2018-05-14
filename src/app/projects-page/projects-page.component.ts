import { Component, OnInit } from '@angular/core';
import { Project, ProjectService, newProjectInfo } from "../api/project.service";
import { Router } from '@angular/router';
import { UserService, User } from '../api/user.service';
import { TrelloService } from '../api/trello.service';


@Component({
  selector: "app-projects-page",
  templateUrl: "./projects-page.component.html",
  styleUrls: ["./projects-page.component.css"]
})
export class ProjectsPageComponent implements OnInit {


  projects: any = [];
  newProjectInfo: newProjectInfo = new newProjectInfo();
  currentUserId: string;
  autocomplete: { data: { [key: string]: string } };

  constructor(
    private userThing: UserService,
    private apiThing: ProjectService,
    private resThing: Router,
    private trelloService: TrelloService
  ) { }

  ngOnInit() {
    this.trelloService.getBoards()
      .then(( boards ) => {
        console.log( boards );
        this.projects = boards;
        this.fetchUserData();
      })
      .then(() => {
        this.setAutocomplete(this.projects);
      })
      .catch(err => {
        console.log("getProjects ERROR");
        console.log(err);
      });
  }


  authUser() {
    this.trelloService.authUser()
      .then(( success ) => {
        console.log( "authUser SUCCESS" );
        console.log( success );
      })
      .catch(( error ) => {
        console.log( "authUser ERROR" );
        console.log( error );
      })
  }
  
  fetchUserData() {
    // Get the info of the connected user
    this.userThing.check().then(result => {
      this.currentUserId = result.userInfo._id;
    });
  }

  createProject() {
    this.newProjectInfo.owner = this.currentUserId;
    this.newProjectInfo.contributors.push(this.currentUserId);

    this.apiThing
      .postProject(this.newProjectInfo)
      .then(() => {
        console.log(this.newProjectInfo);
        this.resThing.navigateByUrl("/projects");
      })
      // })
      .catch(err => {
        console.log("createProject ERROR");
        console.log(err);
      });
  }

  goToProject(projectId) {
    this.apiThing
      .getProject(projectId)
      .then((project: Project) => {
        this.resThing.navigateByUrl(`/project/${project._id}`);
      })
      .catch(err => {
        console.log("goToProject ERROR");
        console.log(err);
      });
  }

  setAutocomplete(projectList) {
    const autoCompleteData = {};
    projectList.forEach(elem => {
      autoCompleteData[elem.name] = null;
    });

    this.autocomplete = {
      data: autoCompleteData
    };
  }
}
