import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private webSocketSubject!: WebSocketSubject<any>;
  readonly socketUrl:string = "wss://ws.datapool.opendatahub.testingmachine.eu/flightdata/sbs-aggregated";

  constructor() { }

  connect(): void {
    this.webSocketSubject = webSocket(this.socketUrl);
    console.log("ws opened");
  }

  send(message: any): void {
    this.webSocketSubject.next(message);
  }

  messages(): Observable<any> {
    return this.webSocketSubject.asObservable();
  }

  close(): void {
    this.webSocketSubject.complete();
    console.log("ws closed");
  }

}
