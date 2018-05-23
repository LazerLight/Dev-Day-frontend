import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import "rxjs/operator/toPromise";
import { User } from './user.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ProjectService {

  constructor(
    // ajaxTruc is what has acces to the http requests, the get, post, etc.
    private ajaxThing: HttpClient
  ) { }

  
  // GET /api/project/:projectId
  getProject( trelloBoardId ) {
    return this.ajaxThing
    .get( `${environment.backUrl}/api/project/${ trelloBoardId }` )
    .toPromise();
  }
  
  // // POST /api/projects
  postProject( info: newProjectInfo ) {
    return this.ajaxThing
      .post(
        `${environment.backUrl}/api/projects`,
        info
      )
      .toPromise();
  }
  
  // GET /api/projects
  // getProjects() {
  //   return this.ajaxThing
  //     .get( `${environment.backUrl}/api/projects` )
  //     .toPromise();
  // }


  // getUser( username: string ) {
  //   return this.ajaxThing
  //     .get( `${environment.backUrl}/api/search-user/${ username }` )
  //     .toPromise();
  // }

  // postUser( info: addUserInfo ) {
  //   return this.ajaxThing
  //     .post(
  //       `${environment.backUrl}/api/add-contributor`,
  //       info
  //     )
  //     .toPromise();
  // }

  // getUsers(){
  //   return this.ajaxThing
  //   .get( `${environment.backUrl}/api/all-users` )
  //   .toPromise();
  // }


}

export class Project {
  _id: string;
  owner: string;
  githubRepoUrl: string;
  trelloBoardId: string;
  createdAt?: Date;
  updatedAt?: Date;
  // name: string;
  // imageUrl: string;
  // contributors: string[] = [];
  // activityFeed: Object[];
}

export class newProjectInfo {
  githubRepoUrl: string;
  trelloBoardId: string;
  // owner: string; // Specify that the creating user becomes the owner
  // name: string;
  // imageUrl: string;
  // contributors: string[] = []; // Specify that the creating user becomes the first member
}

// export class addUserInfo {
//   userId: string;
//   projectId: string;
// }