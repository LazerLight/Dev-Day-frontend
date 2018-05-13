import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from '../api/project.service';
import { ActivatedRoute } from '@angular/router';
import { GithubApiService, githubEventsApiRes, githubIssuesApiRes } from '../api/github-api.service';

@Component({
  selector: 'app-one-project',
  templateUrl: './one-project.component.html',
  styleUrls: ['./one-project.component.css']
})
export class OneProjectComponent implements OnInit {

  projectId: string;
  project: Project;
  eventsJSON: Array<githubEventsApiRes> = [];
  issuesJSON: Array<githubIssuesApiRes> = [];

  constructor(
    private reqThing: ActivatedRoute,
    private apiThing: ProjectService,
    public gitAPI: GithubApiService,
  ) { }

  ngOnInit() {
    // Get the URL parameters for this route
    this.reqThing.paramMap
      .subscribe(( myParams ) => {
        this.projectId = myParams.get( "projectId" )
        this.fetchProjectData();
      })

    this.getRepoEventsFeed();
    this.getRepoIssuesFeed();
  }

  fetchProjectData() {
    this.apiThing.getProject( this.projectId )
      .then(( result: Project ) => {
        this.project = result;
      })
      .catch(( err ) => {
        console.log( "fetProjectData ERROR" );
        console.log( err );
      })
  }



  getRepoEventsFeed(){
    this.gitAPI.githubEventsFeed("LPsola","Project03-frontend")
    // this.gitAPI.githubEventsFeed("jaredhanson","passport")    
      .then((result:any) => {
        this.eventsJSON = this.gitAPI.filterGithubEventsFeed(result)
        console.log(`githubEventsFeed results: this.apiInfo`,result)
      })
      .catch((err) => {
        console.log(`Error getting github feed: ${err}`)
      })
  }

  getRepoIssuesFeed(){
    this.gitAPI.githubIssuesFeed("jaredhanson","passport")
      .then((result:any) => {
        this.issuesJSON = this.gitAPI.filterGithubIssuesFeed(result)
        
        // console.log(`githubIssuesFeed results: this.apiInfo`,result)
      })
      .catch((err) => {
        console.log(`Error getting github feed: ${err}`)
      })
  }

}
