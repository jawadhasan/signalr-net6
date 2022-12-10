import 'regenerator-runtime/runtime'

import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import './resources/bootstrap.pulse.min';

//jquery
import "./import-jquery.js";
import ko from "knockout";

import * as signalR from '@microsoft/signalr'

export class DemoApp {

  constructor() {
    var self = this;   
    
    this.title = ko.observable('Chat Room');
    this.pageAlert = ko.observable("");

    this.signalRConnected = ko.observable(false);
    this.connectionId = ko.observable("");

    this.nick = ko.observable("");
    this.isJoined = ko.observable(false);
    this.messageText = ko.observable("");
    this.chatMessages = ko.observableArray([]);
    this.onlineUsers = ko.observableArray([]); 

    //signalR Connection
    this.connection = new signalR.HubConnectionBuilder()       
      //.withUrl("http://localhost:5000/chatHub") //when testing locally
      .withUrl("https://signalrbasicsetup.r8lru52odt8au.eu-central-1.cs.amazonlightsail.com/chatHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    //SignalR EventWiring
    this.connection.onclose(async () => {      
      console.log('SignalR connection closed.')
      this.connectionId("");
      this.signalRConnected(false);
      this.pageAlert("SignalR connection closed.")
      setTimeout(self.start, 5000);
    }, function (d) {
      console.log('some starterror', d);
    });    

    //method wiring which server will call 
    this.connection.on("signalRConnected", data => {
      console.log('signalRConnected', data);
      this.connectionId(data.user);
      this.pageAlert(`signalR connection id ${this.connectionId()}`);
    });
    this.connection.on("onlineUsers", data => {
      console.log('onlineUsers', data);
      self.onlineUsers.removeAll();   
      //looping through array
      ko.utils.arrayForEach(data, function (item) {
        self.onlineUsers.unshift(item);
      });
    });
    this.connection.on("userJoined", data => {
      console.log('userJoined', data);
      this.chatMessages.unshift(data)
    });
    this.connection.on("setNickName", data => {
      console.log('setNickName', data);
      this.nick(data);
      this.isJoined(true);
      localStorage.setItem("localnick", this.nick());     
    });   
    this.connection.on("chatMsgReceived", data => {
      console.log('chatMsgReceived', data);
      //this.chatMessages.push(data);
      this.chatMessages.unshift(data);// inserts a new item at the beginning of the array

    });
    this.connection.on("chatHistReceived", data => {
      //looping through array
      ko.utils.arrayForEach(data, function (item) {
        self.chatMessages.unshift(item);
      });
    });
    // Load the stuff from local storage
    let localNick = localStorage.getItem("localnick");
    if (localNick) { // undefined if there is nothing in local storage
      this.nick(localNick);
    }

  }

  //start signalR connection
  start() {
    try {

      this.connection.start(() => {
        console.log(`connection started.`);
      }).then(() => {
        console.log(`SignalR connected.`);
        this.signalRConnected(true);
        this.pageAlert("SignalR connected.")

      });

    } catch (err) {
      console.log(err);      
      setTimeout(this.start, 5000);
    }
  };

  //Actions triggered from UI Buttons
  join() {
    this.connection.invoke("Join", this.nick(), this.connectionId());   
  }

  say() {
    this.connection.invoke("Say", this.nick(), this.messageText()) //manually passing username
    this.messageText("");//clear
  }
  clearChat() {
    console.log('clear-chat action');
    this.chatMessages.removeAll();
  }

  getChatHistory() {
    this.connection.invoke("GetChatHistory");
  }
}

//ready function
$(function () {

  console.log('ready called');

  //kncokout binding
  let elem = document.getElementById("indexPage");
  var demoApp = new DemoApp();
  ko.applyBindings(demoApp, elem);

  //start the app
  demoApp.start();
});