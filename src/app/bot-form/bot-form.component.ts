import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { throws } from "assert";

declare var cf: any;
declare var webkitSpeechRecognition: any;

@Component({
  selector: "app-bot-form",
  templateUrl: "./bot-form.component.html",
  styleUrls: ["./bot-form.component.css"]
})
export class BotFormComponent implements OnInit {
  constructor(private blah: ActivatedRoute, private blah1: Router) {}

  ngOnInit() {
    var finalTranscript;

    //
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

    // here we use https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
    // you can use what ever API you want, ex.: Google Cloud Speech API -> https://cloud.google.com/speech/

    // here we create our input
    if (SpeechSynthesisUtterance && SpeechRecognition) {
      var microphoneInput = {
        init: function() {
          // init is called one time, when the custom input is instantiated.

          // load voices \o/
          synth = window.speechSynthesis;
          msg = new SpeechSynthesisUtterance();
          window.speechSynthesis.onvoiceschanged = function(e) {
            var voices = synth.getVoices();
            msg.voice = voices[0]; // <-- Alex
            msg.lang = msg.voice.lang; // change language here
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

          // do other init stuff, like connect with external APIs ...
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
          // input is called when user is interacting with the CF input button (UserVoiceInput)

          // connect to Speech API (ex. Google Cloud Speech), Watson (https://github.com/watson-developer-cloud/speech-javascript-sdk) or use Web Speech API (like below), resolve with the text returned..
          // using Promise pattern -> https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
          // if API fails use reject(result.toString())
          // if API succedes use resolve(result.toString())

          if (recognition) recognition.stop();

          (recognition = new SpeechRecognition()), (finalTranscript = "");

          recognition.continuous = false; // react only on single input
          recognition.interimResults = false; // we don't care about interim, only final.

          // recognition.onstart = function() {}
          recognition.onresult = function(event) {
            // var interimTranscript = "";
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
    //

    const botForm = new cf.ConversationalForm.startTheConversation({
      formEl: document.querySelector("#my-form-element"),
      context: document.querySelector(".bot"),
      loadExternalStyleSheet: false,
      //
      eventDispatcher: dispatcher,

      // add the custom input (microphone)
      microphoneInput: microphoneInput,
      //
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
        console.log("Formdata, serialized:", formDataSerialized.name);
        this.blah1.navigateByUrl("/");
        // this.doStuff();
        // document.getElementById("conversational-form").style.display = "none";
      }
    });
  }
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
