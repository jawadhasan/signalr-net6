// import * as bootstrap from 'bootstrap';

import signalr from '@microsoft/signalr'

export class SignalRServie {

    constructor(){

        this.connection = new signalR.HubConnectionBuilder()
        .withUrl("/productHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();
    }
}