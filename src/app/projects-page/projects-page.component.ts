import { Component, OnInit } from '@angular/core';
import { Project, ProjectService, newProjectInfo } from "../api/project.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit {

  projects: Project[] = [];
  newProjectInfo: newProjectInfo = new newProjectInfo();
  
  constructor(
    private apiThing: ProjectService,
    private resThing: Router
  ) { }

  ngOnInit() {
    this.apiThing.getProjects()
      .then(( projectsList: Project[] ) => {
        this.projects = projectsList;
      })
      .catch(( err ) => {
        console.log( "getProjects ERROR" );
        console.log( err );
      })
  }

  createProject() {
    this.apiThing.postProject( this.newProjectInfo )
      .then(() => {
        this.resThing.navigateByUrl( "/projects" );
      })
      .catch(( err ) => {
        console.log( "createProject ERROR" );
        console.log( err );
      })
  }

}
