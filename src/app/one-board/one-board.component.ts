import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User, UserService } from "../api/user.service";
import {
  GithubApiService,
  githubEventsApiRes,
  githubIssuesApiRes
} from "../api/github-api.service";
import { TrelloService } from "../api/trello.service";

@Component({
  selector: 'app-one-board',
  templateUrl: './one-board.component.html',
  styleUrls: ['./one-board.component.css']
})
export class OneBoardComponent implements OnInit {
  currentUserId: string;
  
  boardId: string;
  board;
  members;
  lists;
  
  eventsJSON: Array<githubEventsApiRes> = [];
  issuesJSON: Array<githubIssuesApiRes> = [];
  
  username: string;

  autocomplete: { data: { [key: string]: string } };
  users: User[] = [];



  constructor(
    private reqThing: ActivatedRoute,
    public gitAPI: GithubApiService,
    private resThing: Router,
    private userThing: UserService,
    private trelloThing: TrelloService
  ) {}

  ngOnInit() {
    // Get the URL parameters for this route
    this.reqThing.paramMap.subscribe(myParams => {
      this.boardId = myParams.get( "boardId" );
      this.fetchBoardData();
      this.fetchUserData();
    });

    this.getRepoEventsFeed();
    this.getRepoIssuesFeed();
  }

  fetchBoardData() {
    this.trelloThing.getBoard( this.boardId )
      .then(( board ) => {
        this.board = board;
        console.log( "BOARD CONSOLE LOG", this.board );
        return this.trelloThing.getMembers( this.boardId )
      })
      .then(( members ) => {
        this.members = members;
        console.log( "MEMBERS HERE" );
        console.log( this.members );
        return this.trelloThing.getLists( this.boardId )
      })
      .then(( lists ) => {
        this.lists = lists;
        console.log( this.lists );
      })
      .catch(( error ) => {
        console.log( "fetchBoardData ERROR" );
        console.log( error );
      })
  }

  getRepoEventsFeed() {
    this.gitAPI
      .githubEventsFeed("LPsola", "Project03-frontend")
      // this.gitAPI.githubEventsFeed("jaredhanson","passport")
      .then((result: any) => {
        this.eventsJSON = this.gitAPI.filterGithubEventsFeed(result);
      })
      .catch(err => {
        console.log(`Error getting github feed: ${err}`);
      });
  }

  getRepoIssuesFeed() {
    this.gitAPI
      .githubIssuesFeed("jaredhanson", "passport")
      .then((result: any) => {
        this.issuesJSON = this.gitAPI.filterGithubIssuesFeed(result);

        // console.log(`githubIssuesFeed results: this.apiInfo`,result)
      })
      .catch(err => {
        console.log(`Error getting github feed: ${err}`);
      });
  }

  fetchUserData() {
    // Get the info of the connected user
    this.userThing.check().then(result => {
      console.log( result );
      this.currentUserId = result.userInfo._id;
    });
  }

  setAutocomplete(userList) {
    this.autocomplete = {
      data: userList
    };
  }

  goToBot( boardId ) {
    this.trelloThing.getBoard( boardId )
      .then(( board ) => {
        this.resThing.navigateByUrl(`/board/${ boardId }/bot`);
      })
      .catch(err => {
        console.log("goToProject ERROR");
        console.log(err);
      });
  }
}
