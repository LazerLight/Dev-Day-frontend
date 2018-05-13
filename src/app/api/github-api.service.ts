import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/operator/toPromise'

@Injectable()
export class GithubApiService {
  
  constructor(
    private ajaxs: HttpClient
  ) { }
  
  githubEventsFeed(repoOwner, repoName) {
    return this.ajaxs
    .get(`https://api.github.com/networks/${repoOwner}/${repoName}/events`)
    .toPromise();
  }

  githubIssuesFeed(repoOwner, repoName) {
    return this.ajaxs
    .get(`https://api.github.com/repos/${repoOwner}/${repoName}/issues?state=open&sort=created&direction=desc`)
    .toPromise();
  }

  filterGithubEventsFeed(apiResponseJSON){
    const filteredArr = apiResponseJSON.filter(elem =>{
      return elem.type === "PushEvent"
    })
    return filteredArr
  }

  filterGithubIssuesFeed(apiResponseJSON){
    const filteredArr = [];
    const issueNumInArr = []
    apiResponseJSON.forEach(elem =>{
      if (issueNumInArr.indexOf(elem.number) < 0){
        filteredArr.push(elem)
        issueNumInArr.push(elem.number)
      }
    })
    return filteredArr
  }

  
}

export class githubEventsApiRes {
  type: String;
  actor: Array<any>;
  payload: Array<any>;
}

export class githubIssuesApiRes {
  type: String;
  actor: Array<any>;
  payload: Array<any>;
}