import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User, UserService } from "../api/user.service";
import {
  GithubApiService,
  githubEventsApiRes,
  githubIssuesApiRes
} from "../api/github-api.service";
import { TrelloService } from "../api/trello.service";
import { ProjectService } from "../api/project.service";
declare var TrelloCards: any;

@Component({
  selector: "app-one-board",
  templateUrl: "./one-board.component.html",
  styleUrls: ["./one-board.component.css"]
})
export class OneBoardComponent implements OnInit {
  currentUserId: string;
  myUser;
  
  githubRepoUrl;
  
  boardId: string;
  board;
  members;
  lists;
  backlogList;
  doingList;
  donelist;
  backlogCards;
  doingCards;
  doneCards;
  doingCardDuration: number;
  startTime: Object[] = [];
  startTimeNumber: number = 9;
  gitHubUrl: string;
  isAdmin: boolean;
  projectDocument;
  
  eventsJSON: Array<githubEventsApiRes> = [];
  issuesJSON: Array<githubIssuesApiRes> = [];
  pullReqJSON: Array<githubIssuesApiRes> = [];
  
  users: User[] = [];
  today: Date;
  
  constructor(
    private reqThing: ActivatedRoute,
    private gitAPI: GithubApiService,
    private resThing: Router,
    private userThing: UserService,
    private trelloThing: TrelloService,
    private project: ProjectService,
  ) {}
  
  ngOnInit() {
    this.today = new Date();
    // Get the URL parameters for this route
    this.reqThing.paramMap.subscribe(myParams => {
      this.boardId = myParams.get("boardId");
      this.getMyUser();
      this.fetchBoardData();
    });

    this.fetchProjectData()


  }
  
  getMyUser() {
    this.trelloThing
    .getMyUser()
    .then(myUser => {
      this.myUser = myUser;
      // console.log("MY ID", this.myUser.id);
      // console.log("MY USER OBJECT", this.myUser);
    })
    .catch(error => {
      console.log(error);
    })
  }
  
  fetchProjectData() {
    this.project.getProject(this.boardId)
      .then( results =>{
        this.projectDocument = results
      })
      .then(()=>{
        this.githubFeedTrigger()
      })
      .catch(err =>{
        console.log("fetchProjectData error: ", err)
      })

  }

  isBoardAdmin() {
    this.members.forEach(m => {
      if (m.idMember === this.myUser.id && m.memberType === "admin") {
        return (this.isAdmin = true);
      }
    });
  }
  
  fetchBoardData() {
    this.trelloThing
    .getBoard(this.boardId)
    .then(board => {
      this.board = board;
      // console.log("BOARD CONSOLE LOG", this.board);
      return this.trelloThing.getMembers(this.boardId);
    })
    .then(members => {
      this.members = members;
      // console.log("MEMBERS", this.members);
      // console.log( "MEMBERS HERE" );
      // console.log( this.members );
      return this.trelloThing.getLists(this.boardId);
    })
    .then(lists => {
      this.lists = lists;
      // console.log( "LISTS" );
      // console.log( this.lists );
      // console.log("LIST", this.lists[2].id);
      // console.log("LISTS", this.lists);
      this.backlogList = this.lists.filter(l => l.name === "BACKLOG");
      this.doingList = this.lists.filter(l => l.name === "DOING");
      this.donelist = this.lists.filter(l => l.name === "DONE");
      // console.log("DOING LIST");
      // console.log(this.backlogList);
      // console.log(this.doingList);
      // console.log(this.donelist);
      return this.trelloThing.getCards(this.doingList[0].id);
    })
    .then(cards => {
      this.doingCards = cards;
      // console.log("DOING CARDS");
      // console.log(this.doingCards);
      // console.log(
      //   "TYPE OF CARD MEMBER ID",
      //   typeof this.doingCards[0].idMembers[0]
      // );
      this.doingCards.forEach(oneCard => {
        let startTimeObject = {};
        if (oneCard.idMembers.includes(this.myUser.id)) {
          {
            (startTimeObject["time"] = this.startTimeNumber),
            (startTimeObject["cardId"] = oneCard.id),
            (startTimeObject["name"] = oneCard.name),
            (startTimeObject["cardId"] = oneCard.id),
            (startTimeObject["url"] = oneCard.url);
          }
          this.startTimeNumber =
          Number(oneCard.labels[0].name) + this.startTimeNumber;
          this.startTime.push(startTimeObject);
          console.log(this.startTime);
        }
      });
      
      // console.log("TYPE OF CURRENT USER ID", typeof this.currentUserId);
      setTimeout(
        () =>
        TrelloCards.load(document, {
          compact: false,
          allAnchors: false
        }),
        0
      );
      return this.trelloThing.getCards(this.backlogList[0].id);
    })
    .then(cards => {
      this.backlogCards = cards;
      return this.trelloThing.getCards(this.donelist[0].id);
    })
    .then(cards => {
      this.doneCards = cards;
      // console.log("MEMBERS", this.members);
      return this.isBoardAdmin();
    })
    .then(() => {
      // console.log("IS ADMIN", this.isAdmin);
    })
    .catch(error => {
      console.log("fetchBoardData ERROR");
      console.log(error);
    });
  }
  
  
  moveToDoing(cardId, doingListId) {
    this.trelloThing
    .moveToDoing(cardId, doingListId, this.myUser.id)
    .then(() => {
      console.log("Card moved to doing!");
    })
    .catch(err => {
      console.log("moveToDoing ERROR");
      console.log(err);
    });
  }
  
  moveToDone(cardId: string, donelistId: string) {
    this.trelloThing
    .moveToDone(cardId, donelistId)
    .then(() => {
      console.log("Card moved to done!");
    })
    .catch(err => {
      console.log("moveToDone ERROR");
      console.log(err);
    });
  }
  
  updateGitHubUrl() {
    let url =     this.githubRepoUrl + "/"
    let beginUrlSection = url.indexOf("github.com/");
    if(beginUrlSection < 0){
      return false
    }
    
    let firstSlash = url.indexOf("/", beginUrlSection + 11);
    let secondSlash = url.indexOf("/", firstSlash + 1);
    let githubRepoUrlSection = url.slice(beginUrlSection + 11, secondSlash);
    
    

    const projectInfo = {
      "githubRepoUrl" : githubRepoUrlSection,
      "trelloBoardId" : this.boardId
    }
    
    this.getRepoEventsFeed(githubRepoUrlSection);
    this.getRepoIssuesFeed(githubRepoUrlSection);
    this.getRepoPullReqFeed(githubRepoUrlSection);

    this.project.postProject(projectInfo)

  }
  
  getRepoEventsFeed(repoUrlSection) {
    this.gitAPI
    .githubEventsFeed(repoUrlSection)
    .then((result: any) => {
      this.eventsJSON = this.gitAPI.filterGithubEventsFeed(result);
    })
    .catch(err => {
      console.log(`Error getting github events feed: ${err}`);
    });
  }
  
  getRepoIssuesFeed(repoUrlSection) {
    this.gitAPI
    .githubIssuesFeed(repoUrlSection)
    .then((result: any) => {
      this.issuesJSON = this.gitAPI.filterGithubIssuesFeed(result);
    })
    .catch(err => {
      console.log(`Error getting github issues feed: ${err}`);
    });
  }
  
  getRepoPullReqFeed(repoUrlSection) {
    this.gitAPI
    .githubPullReqFeed(repoUrlSection)
    .then((result: any) => {
      this.pullReqJSON = result;
    })
    .catch(err => {
      console.log(`Error getting github pull req feed: ${err}`);
    });
  }

  githubFeedTrigger(){
    if(this.projectDocument.githubRepoUrl){
      this.getRepoEventsFeed(this.projectDocument.githubRepoUrl);
      this.getRepoIssuesFeed(this.projectDocument.githubRepoUrl);
      this.getRepoPullReqFeed(this.projectDocument.githubRepoUrl);
    }
  }
  // fetchUserData() {
  //   // Get the info of the connected user
    // this.userThing.check()
  //     .then( result => {
  //       console.log( "USER" );
  //       console.log( result );
  //       this.currentUserId = result.userInfo._id;
  //       console.log( "USER ID" );
  //       console.log( this.currentUserId );
  //     })
  //     .catch(( err ) => {
  //       console.log( "fetchUserData ERROR" );
  //       console.log( err );
  //     })
  // }
  
  
  goToBot(boardId) {
    this.trelloThing
    .getBoard(boardId)
    .then(board => {
      this.resThing.navigateByUrl(`/board/${boardId}/bot`);
    })
    .catch(err => {
      console.log("goToProject ERROR");
      console.log(err);
    });
  }
}

export class GitHubUrl {
  repoName: string;
  repoOwner: string;
}
