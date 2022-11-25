import 'regenerator-runtime/runtime'

import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import './resources/bootstrap.pulse.min';

//jquery and jquery-ui
import "./import-jquery.js";

import makeAjaxRequest from "./ajaxService.js";

import ko from "knockout";

// Import all plugins
import * as bootstrap from 'bootstrap';

// Or import only needed plugins
//import { Tooltip as Tooltip, Toast as Toast, Popover as Popover } from 'bootstrap';



import * as signalR from '@microsoft/signalr'

export class DemoApp {

  constructor() {
    var self = this;

    this.vm = {
      title: ko.observable('Devices')
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5229/productHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onclose(async () => {
      //await start();
      console.log('signalR connection closed.')
    });

    //method wiring which server will call
    this.connection.on("methodOnClient", data => {
      self.handleMethodOnClient(data);
    });


    this.connection.start(() => {
      console.log(`connection started.`);
    }).then(() => this.connection.invoke("SendMessageToAll", "hello-FromBrowser"));

  }


  handleMethodOnClient(msg) {
    console.log(`method handler on DemoApp.${msg}`);
  }
}

//ready function

$(function () {
  console.log('ready called');

  let elem = document.getElementById("indexPage");
  var demoApp = new DemoApp();
  ko.applyBindings(demoApp.vm, elem);


  //btn event wiring
  $("#btnLoadData").on('click', (e) => {
    alert('someaction');
  });

});