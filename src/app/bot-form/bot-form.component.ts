import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService, Project } from "../api/project.service";
import { UserService, User } from "../api/user.service";
import { List, Card, CardService } from "../api/card.service";
import { TrelloService } from "../api/trello.service";

declare var cf: any;
declare var webkitSpeechRecognition: any;

@Component({
  selector: "app-bot-form",
  templateUrl: "./bot-form.component.html",
  styleUrls: ["./bot-form.component.css"]
})
export class BotFormComponent implements OnInit {
  board; // Allows us to retrieve board for one project with getBoard function
  boardId: string; // getBoard needs boardId as parameter
  trelloLists; // Allows us to retrieve lists for one board with getLists function
  backlogCards; // Get cards in list named backlog (not case sensitive)
  doingCards; // Get cards in list named doing (not case sensitive)
  trelloUser; // Gets logged in trello user
  trelloUserId; // Gets his id
  trelloDoingId: string; // Id of the trello doing list

  // Variables to show backlog cards with the bot and select them
  formDataCard: string[] = []; // records in an array all live responses in the bot (in flowCallBack)
  taskDurationTotal: number = 0; // records the sum of all cards' duration
  lastTaskDuration: number = 0; // records the duration of the last chosen card
  testCardsArray: Object[] = []; // records all the cards in the backlog to suggest them to user
  testCardsArraySecurity: string[] = []; // records the name of the cards ==> must correspond to what's in testCardsArray to keep track of the cards in it and not suggest the same ones again
  spliceIndexFinder: string[] = []; // records the name of the cards ==> must correspond to what's in testCardsArray to get splice index
  testCardsArraySpliceIndex: number; // splice index from spliceIndexFinder.indexOf(oneCard.name)

  constructor(
    private reqThing: ActivatedRoute,
    private resThing: Router,
    public apiProjects: ProjectService,
    public apiUsers: UserService,
    public apiCards: CardService,
    public apiTrello: TrelloService
  ) {}

  ngOnInit() {
    this.reqThing.paramMap.subscribe(myParams => {
      this.boardId = myParams.get("boardId");
      this.fetchProjectData();
      this.fetchUserData();
    });
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
          window.speechSynthesis.onvoiceschanged = function(e) {
            var voices = synth.getVoices();
            msg.voice = voices[7]; // <-- Alex
            msg.lang = msg.voice.lang;
          };
          synth.getVoices();

          // here we want to control the Voice input availability, so we don't end up with speech overlapping voice-input
          msg.onstart = function(event) {
            // on message end, so deactivate input
            console.log("voice: deactivate 1");
            botForm.userInput.deactivate();
          };

          msg.onend = function(event) {
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
        cancelInput: function() {
          console.log("voice: CANCEL");
          finalTranscript = null;
          if (recognition) {
            recognition.onend = null;
            recognition.onerror = null;
            recognition.stop();
          }
        },
        input: function(resolve, reject, mediaStream) {
          console.log("voice: INPUT");

          if (recognition) recognition.stop();

          (recognition = new SpeechRecognition()), (finalTranscript = "");

          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onresult = function(event) {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              }
            }
          };

          recognition.onerror = function(event) {
            reject(event.error);
          };

          recognition.onend = function(event) {
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
      let keys = Object.keys(liveAnswer);
      let liveAnswerKey = keys[keys.length - 1];

      console.log("DOING CARDS: ", this.doingCards);
      console.log("whole answer:", liveAnswer);
      console.log("key:", liveAnswerKey);
      console.log("property:", liveAnswer[liveAnswerKey]);
      if (this.taskDurationTotal <= 8) {
        this.formDataCard.push(liveAnswer[liveAnswerKey].toString());
      }

      console.log("FORM DATA CARD:", this.formDataCard);
      console.log("SPLICE INDEX FINDER:", this.spliceIndexFinder);
      console.log(this.formDataCard[this.formDataCard.length - 1]);
      if (this.formDataCard[this.formDataCard.length - 1] === "end-convo") {
        this.resThing.navigateByUrl(`/board/${this.boardId}`);
      }
      /// CHECK DOING ARRAY TEST

      //////
      if (this.taskDurationTotal <= 8) {
        let spliceIndex;
        this.backlogCards.forEach(oneCard => {
          this.formDataCard.forEach(oneDataCard => {
            oneCard.labels.forEach(oneLabel => {
              console.log(
                "ONE CARD STRUCTURE TO GET LABELS",
                typeof oneLabel.name
              );
              let cardDuration = Number(oneLabel.name);
              let testTag = {};
              if (
                oneDataCard === oneCard.name &&
                this.formDataCard.indexOf(oneDataCard) ===
                  this.formDataCard.length - 1
              ) {
                console.log(
                  "data vard vs. card loop",
                  oneDataCard,
                  oneCard.name
                );
                spliceIndex = this.spliceIndexFinder.indexOf(oneCard.name);
                if (this.taskDurationTotal + cardDuration <= 8) {
                  this.taskDurationTotal += cardDuration;
                  this.lastTaskDuration = cardDuration;
                  // move to doing
                  this.apiTrello
                    .moveToDoing(
                      oneCard.id,
                      this.trelloDoingId,
                      this.trelloUserId
                    )
                    .then(() => {
                      console.log("Card moved to doing!");
                    })
                    .catch(err => {
                      console.log("moveToDoing ERROR");
                      console.log(err);
                    });
                  console.log(
                    "total task duration in loop",
                    this.taskDurationTotal
                  );
                } else {
                  alert(
                    `Looks like you already have 8 hours of work lined up for your day! Should be enough, plus you have to save some for tomorrow 😇`
                  );
                  this.resThing.navigateByUrl(`/board/${this.boardId}`);
                }
                console.log(oneDataCard, oneCard.name);
                return;
              } else if (!this.testCardsArraySecurity.includes(oneCard.name)) {
                {
                  (testTag["tag"] = "option"),
                    (testTag["cf-label"] = oneCard.name),
                    (testTag["value"] = oneCard.name);
                }
                this.testCardsArraySecurity.push(oneCard.name);
                this.testCardsArray.push(testTag);
                this.spliceIndexFinder.push(oneCard.name);
                console.log("testcardsarray: ", this.testCardsArray);
              } else {
                return;
              }
            });
          });
        });
        console.log("total task duration post loop", this.taskDurationTotal);
        console.log("indexFinder", this.testCardsArraySecurity);
        console.log("testsecurity", this.testCardsArraySecurity);
        console.log("testcardsarray: ", this.testCardsArray);

        console.log("splice Index", spliceIndex);
        if (spliceIndex !== undefined) {
          console.log("bula");
          console.log("1 array", this.testCardsArray);
          console.log("1 array length", this.testCardsArray.length);
          console.log("1 array splice index", this.spliceIndexFinder);
          console.log(
            "1 array  splice index length",
            this.spliceIndexFinder.length
          );
          this.testCardsArray.splice(spliceIndex, 1);
          this.spliceIndexFinder.splice(spliceIndex, 1);
        }
        console.log("2 array", this.testCardsArray);
        console.log("2 array length", this.testCardsArray.length);
        console.log("2 array splice index", this.spliceIndexFinder);
        console.log(
          "2 array  splice index length",
          this.spliceIndexFinder.length
        );
        if (
          this.testCardsArray.length <= 0 &&
          this.testCardsArraySecurity.length > 0
        ) {
          alert(
            `Looks like you are out of tasks for the day! Fill out your Trello board and come back when you're ready`
          );
          this.resThing.navigateByUrl(`/board/${this.boardId}`);
        }
        if (this.formDataCard.length === 1) {
          botForm.addTags([
            {
              // select group
              tag: "select",
              name: "task2",
              "cf-questions": `Great! What will you be starting your day with?`,
              children: this.testCardsArray
            }
          ]);
        } else if (this.taskDurationTotal === 8) {
          botForm.addTags([
            {
              // select group
              tag: "select",
              name: "end-message",
              "cf-questions": `Looks like you're ready to start your day!`,
              children: [
                {
                  tag: "option",
                  "cf-label": "Let's Go!",
                  value: "end-convo"
                }
              ]
            }
          ]);
        } else {
          botForm.addTags([
            {
              // select group
              tag: "select",
              name: "task2",
              "cf-questions": `Awesome! You will be working on {previous-answer} which should last ${
                this.lastTaskDuration
              } hours. What's your next move?  || Cool! {previous-answer} should be a great challenge! What will you work on next? (${8 -
                this.taskDurationTotal} hours are left in your schedule) `,
              children: this.testCardsArray
            }
          ]);
        }
      } else {
        alert(
          `Looks like you already have 8 hours of work lined up for your day! Should be enough, plus you have to save some for tomorrow 😇`
        );
        this.resThing.navigateByUrl(`/board/${this.boardId}`);
      }

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
        console.log("Formdata, serialized:", formDataSerialized);
        this.resThing.navigateByUrl(`/board/${this.boardId}`);
      }
    });
  }

  fetchProjectData() {
    let backlogId;
    this.apiTrello
      .getBoard(this.boardId)
      .then((currentBoard: string) => {
        this.board = currentBoard;
        console.log("project name: " + this.board.name);
        // fetch list data
        this.apiTrello.getLists(this.boardId).then(trelloLists => {
          this.trelloLists = trelloLists;
          this.trelloLists.forEach(oneList => {
            console.log("ONE LIST: ", oneList);
            if (oneList.name.toLowerCase() === "backlog") {
              backlogId = oneList.id;
            } else if (oneList.name.toLowerCase() === "doing") {
              this.trelloDoingId = oneList.id;
            }
          });
          console.log(typeof backlogId);
          // fetch cards data
          this.apiTrello.getCards(this.trelloDoingId).then(cardsList => {
            this.doingCards = cardsList;
          });
          this.apiTrello.getCards(backlogId).then(cardsList => {
            this.backlogCards = cardsList;
            setTimeout(() => this.botSetup(), 0);
            console.log("blahblah" + this.formDataCard);
          });
        });
      })
      .catch(err => {
        console.log("fetchProjectData ERROR");
        console.log(err);
      });
  }

  fetchUserData() {
    // Get the info of the connected user
    this.apiTrello.getMyUser().then(result => {
      this.trelloUser = result;
      this.trelloUserId = this.trelloUser.id;
      console.log("userData success");
    });
  }
}
