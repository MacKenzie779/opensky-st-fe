import { MapPlane } from './../_models/map.plane';
import { WebSocketService } from '@app/_services/web-socket.service';
import { AuthenticationService } from './../_services/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapPlanePosition } from '@app/_models/map.plane.position';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit, OnDestroy {

  // subscription of ws, to unsubscribe on destroy
  subscription:any;

  mySidebar:any = null;
  menu:boolean = false;
  results:number = 5;
  public flights:Array<MapPlane> = []

  constructor(public authService:AuthenticationService, private ws: WebSocketService) {}

  ngOnInit(): void {
    this.ws.connect();
    this.subscription = this.ws.messages().subscribe(resp => {
      if (resp["Tail"]) {
        // if code is equal --> not a new plane
        const planeExists = this.flights.find(obj => obj.flightcode == resp["Tail"]);
        if (planeExists) {
          // searching index of plane in array
          const planeIndex = this.flights.findIndex(plane => plane.flightcode == resp["Tail"]);
          if (planeIndex >= 0) {
            // modify plane
            this.flights[planeIndex].timestamp = Date.now();
            this.flights[planeIndex].type = resp["Emitter_category"];
            this.flights[planeIndex].speed = Number((resp["Speed"] * 1.852).toFixed(2));
            this.flights[planeIndex].height = Number((resp["Alt"] * 0.3048).toFixed(2));
            this.flights[planeIndex].track = resp["Track"];
            this.flights[planeIndex].positions.push(new MapPlanePosition(resp["Lat"], resp["Lng"]));
          }
        }
        else {
          // add new plane
          this.flights.push(
            new MapPlane(Date.now(), resp["Tail"], resp["Emitter_category"],
            Number((resp["Speed"] * 1.852).toFixed(2)), Number((resp["Alt"] * 0.3048).toFixed(2)), resp["Track"], [new MapPlanePosition(resp["Lat"], resp["Lng"])])
          );
        }
      }
    });
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    this.ws.close();
  }

  toggleMenu() {
    this.menu = !this.menu;
  }

  open_sidebar(): void {
    this.mySidebar = document.getElementById("mySidebar");
    if (this.mySidebar.style.display === 'block') {
      this.mySidebar.style.display = 'none';
    } else {
      this.mySidebar.style.display = 'block';
    }
  }

  close_sidebar(): void {
    this.mySidebar.style.display = "none";
  }

}
