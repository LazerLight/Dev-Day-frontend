import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService, Project } from "../api/project.service";
import { UserService, User } from "../api/user.service";
import { List, Card, CardService } from "../api/card.service";

declare var cf: any;
declare var webkitSpeechRecognition: any;

@Component({
  selector: "app-bot-form",
  templateUrl: "./bot-form.component.html",
  styleUrls: ["./bot-form.component.css"]
})
export class BotFormComponent implements OnInit {
  project: Project;
  lists: List[] = [];
  cards: Card[] = [];
  projectId: string;
  listId: string;
  currentUserId: string;
  formDataList: string;
  formDataCard: string;
  constructor(
    private reqThing: ActivatedRoute,
    private resThing: Router,
    public apiProjects: ProjectService,
    public apiUsers: UserService,
    public apiCards: CardService
  ) {}

  ngOnInit() {
    console.log("blah");
    this.reqThing.paramMap.subscribe(myParams => {
      this.projectId = myParams.get("projectId");
      this.fetchProjectData();
      this.fetchUserData();
      // setInterval(() => this.fetchCardName(), 2000);
    });

    // test with projects

    // this.reqThing.paramMap.subscribe(myParams => {
    //   this.projectId = myParams.get("projectId");
    //   console.log(this.projectId);
    //   this.apiProjects
    //     .getProjects()
    //     .then((projectsList: Project[]) => {
    //       this.projects = projectsList;
    //       console.log(projectsList[0].name);
    //       this.fetchUserData();
    //       setTimeout(() => this.botSetup(), 0);
    //     })
    //     .catch(err => {
    //       console.log("getProjects ERROR");
    //       console.log(err);
    //     });
    // });
  }

  botSetup() {
    // CONFIGURING VOICE OUTPUT AND INPUT;
    var finalTranscript;
    var dispatcher = new cf.EventDispatcher(),
      synth = null,
      recognition = null,
      msg = null,
      SpeechSynthesisUtterance = null,
      SpeechRecognition = null;

    try {
      SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    } catch (e) {
      console.log(
        "Example support range: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility"
      );
    }

    try {
      SpeechSynthesisUtterance =
        (<any>window).webkitSpeechSynthesisUtterance ||
        (<any>window).mozSpeechSynthesisUtterance ||
        (<any>window).msSpeechSynthesisUtterance ||
        (<any>window).oSpeechSynthesisUtterance ||
        (<any>window).SpeechSynthesisUtterance;
    } catch (e) {
      console.log(
        "Example support range: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance#Browser_compatibility"
      );
    }

    // Input Creation
    if (SpeechSynthesisUtterance && SpeechRecognition) {
      var microphoneInput = {
        init: function() {
          // loading voices
          synth = window.speechSynthesis;
          msg = new SpeechSynthesisUtterance();
          window.speechSynthesis.onvoiceschanged = e => {
            var voices = synth.getVoices();
            msg.voice = voices[0]; // <-- Alex
            msg.lang = msg.voice.lang;
          };
          synth.getVoices();

          // here we want to control the Voice input availability, so we don't end up with speech overlapping voice-input
          msg.onstart = event => {
            // on message end, so deactivate input
            console.log("voice: deactivate 1");
            botForm.userInput.deactivate();
          };

          msg.onend = event => {
            // on message end, so reactivate input
            botForm.userInput.reactivate();
          };

          // setup events to speak robot response
          dispatcher.addEventListener(
            cf.ChatListEvents.CHATLIST_UPDATED,
            function(event) {
              if (event.detail.currentResponse.isRobotResponse) {
                // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
                // msg.text = event.detail.currentResponse.response
                msg.text = event.detail.currentResponse.strippedSesponse; //<-- no html tags
                window.speechSynthesis.speak(msg);
              }
            },
            false
          );
        },
        // set awaiting callback, as we will await the speak in this example
        awaitingCallback: true,
        cancelInput: () => {
          console.log("voice: CANCEL");
          finalTranscript = null;
          if (recognition) {
            recognition.onend = null;
            recognition.onerror = null;
            recognition.stop();
          }
        },
        input: (resolve, reject, mediaStream) => {
          console.log("voice: INPUT");

          if (recognition) recognition.stop();

          (recognition = new SpeechRecognition()), (finalTranscript = "");

          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onresult = event => {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              }
            }
          };

          recognition.onerror = event => {
            reject(event.error);
          };

          recognition.onend = event => {
            if (finalTranscript && finalTranscript !== "") {
              resolve(finalTranscript);
            }
          };

          recognition.start();
        }
      };
    }
    const flowCallback = (dto, success, error) => {
      let liveAnswer = botForm.getFormData(true);
      let liveAnswerKey = Object.keys(liveAnswer).toString();
      let liveAnswerKeySplit = liveAnswerKey.split(",");
      let liveAnswerProperty = liveAnswerKey[liveAnswerKey];
      console.log("key: " + liveAnswerKey);
      console.log(
        "property: " +
          liveAnswer[liveAnswerKeySplit[liveAnswerKeySplit.length - 1]]
      );
      console.log("YAAAAA: " + typeof this.formDataCard);
      this.formDataCard =
        liveAnswer[liveAnswerKeySplit[liveAnswerKeySplit.length - 1]];
      this.cards.forEach(oneCard => {
        if (this.formDataCard === undefined) {
          console.log("heheheh");
        } else if (this.formDataCard === oneCard.name) {
          console.log("lalalalal");
        } else {
          console.log("blalalala");
          return;
        }
      });
      console.log(this.cards);
      // this.formDataCard =
      //   liveAnswer[liveAnswerKeySplit[liveAnswerKeySplit.length - 1]];
      console.log("FORM DATA CARD: " + this.formDataCard);
      console.log(
        "dto....",
        dto.text,
        success,
        error,
        botForm.getFormData(true)
      );
      success();
    };

    // INITIALIZE CONVERSATIONAL FORM
    const botForm = new cf.ConversationalForm.startTheConversation({
      formEl: document.querySelector("#my-form-element"),
      context: document.querySelector(".bot"),
      loadExternalStyleSheet: false,
      //
      eventDispatcher: dispatcher,

      // add the custom input (microphone)
      microphoneInput: microphoneInput,
      flowStepCallback: flowCallback,
      submitCallback: () => {
        const formData = botForm.getFormData();
        const formDataSerialized = botForm.getFormData(true);
        //
        if (!SpeechRecognition) {
          botForm.addRobotChatResponse(
            "SpeechRecognition not supported, so <strong>no</strong> Microphone here."
          );
        }

        if (!SpeechSynthesisUtterance) {
          botForm.addRobotChatResponse(
            "SpeechSynthesisUtterance not supported, so <strong>no</strong> Microphone here."
          );
        }
        //
        console.log("Formdata:", formData);
        console.log("Formdata, serialized:", formDataSerialized.opinion[0]);
        this.formDataList = formDataSerialized.opinion[0];

        this.resThing.navigateByUrl(`/project/${this.projectId}`);
      }
    });
  }

  fetchProjectData() {
    let backlogId;
    this.apiProjects
      .getProject(this.projectId)
      .then((currentProject: Project) => {
        this.project = currentProject;
        console.log("project name: " + this.project.name);
        // fetch list data
        this.apiCards.getLists(this.projectId).then((projectLists: List[]) => {
          this.lists = projectLists;
          projectLists.forEach(oneList => {
            if (oneList.name.toLowerCase() === "backlog") {
              backlogId = oneList._id;
            } else {
              alert(
                `Looks like you don't have a backlog list in Trello yet. Your PM mustn't be doing his job properly... Please have him create one and come back when you're ready 😁`
              );
              this.resThing.navigateByUrl(`/project/${this.projectId}`);
            }
          });
          console.log(typeof backlogId);
          // fetch cards data
          this.apiCards
            .getCards(this.projectId, backlogId)
            .then((cardsList: Card[]) => {
              this.cards = cardsList;
              setTimeout(() => this.botSetup(), 0);
            });
        });
      })
      .catch(err => {
        console.log("fetchProjectData ERROR");
        console.log(err);
      });
  }

  // fetchProjectData() {
  //   let backlogId;
  //   this.apiProjects
  //     .getProject(this.projectId)
  //     .then((currentProject: Project) => {
  //       this.project = currentProject;
  //       console.log("project name: " + this.project.name);
  //       // fetch list data
  //       this.apiCards.getLists(this.projectId).then((projectLists: List[]) => {
  //         this.lists = projectLists;
  //         projectLists.forEach(oneList => {
  //           if (oneList.name.toLowerCase() === "backlog") {
  //             backlogId = oneList._id;
  //           } else {
  //             alert(
  //               `Looks like you don't have a backlog list in Trello yet. Your PM mustn't be doing his job properly... Please have him create one and come back when you're ready 😁`
  //             );
  //             this.resThing.navigateByUrl(`/project/${this.projectId}`);
  //           }
  //         });
  //         console.log(this.lists);
  //         console.log(backlogId);
  //         setTimeout(() => this.botSetup(), 0);
  //       });
  //     })
  //     .catch(err => {
  //       console.log("fetchProjectData ERROR");
  //       console.log(err);
  //     });
  // }

  fetchUserData() {
    // Get the info of the connected user
    this.apiUsers.check().then(result => {
      this.currentUserId = result.userInfo._id;
      console.log("userData success");
    });
  }

  // fetchCardName() {
  //   console.log("UPDATED FORMCARD: " + this.formDataCard);
  // }
}

// to get elements create an object like we did in class and in ng oninit fill up that object, then feed database upon submit.

// // In case we want to remove spoken voice and keep mic input
// var dispatcher = new cf.EventDispatcher(),
//   synth = null,
//   recognition = null,
//   msg = null,
//   SpeechRecognition = null;

// try {
//   SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// } catch (e) {
//   console.log(
//     "Example support range: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility"
//   );
// }

// // here we use https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
// // you can use what ever API you want, ex.: Google Cloud Speech API -> https://cloud.google.com/speech/

// if (SpeechRecognition) {
//   // here we create our input
//   var microphoneInput = {
//     // behaviors needs to follow the cf.IUserInput interface, they will be checked
//     init: function() {
//       console.log("voice: init method called from mic integration");
//     },
//     // set awaiting callback to false, as we will NOT await the speak in this example
//     awaitingCallback: false,
//     cancelInput: function() {
//       console.log("voice: CANCEL");
//       finalTranscript = null;
//       if (recognition) {
//         recognition.onend = null;
//         recognition.onerror = null;
//         recognition.stop();
//       }
//     },
//     input: function(resolve, reject, mediaStream) {
//       console.log("voice: INPUT");
//       // input is called when user is interacting with the CF input button (UserVoiceInput)

//       // connect to Speech API (ex. Google Cloud Speech), Watson (https://github.com/watson-developer-cloud/speech-javascript-sdk) or use Web Speech API (like below), resolve with the text returned..
//       // using Promise pattern -> https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
//       // if API fails use reject(result.toString())
//       // if API succedes use resolve(result.toString())

//       if (recognition) recognition.stop();

//       (recognition = new SpeechRecognition()), (finalTranscript = "");

//       recognition.continuous = false; // react only on single input
//       recognition.interimResults = false; // we don't care about interim, only final.

//       // recognition.onstart = function() {}
//       recognition.onresult = function(event) {
//         // var interimTranscript = "";
//         for (var i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript;
//           }
//         }
//       };

//       recognition.onerror = function(event) {
//         reject(event.error);
//       };

//       recognition.onend = function(event) {
//         if (finalTranscript && finalTranscript !== "") {
//           resolve(finalTranscript);
//         }
//       };

//       recognition.start();
//     }
//   };
// }
// //
