import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from "../api/project.service";

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit {

  projects: Project[] = [];
  
  constructor(
    private apiThing: ProjectService
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

}
