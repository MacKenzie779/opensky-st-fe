import { MapPlanePosition } from './../_models/map.plane.position';
import { MapPlane } from './../_models/map.plane';
import { AuthenticationService } from './../_services/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '@app/_services/web-socket.service';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';

interface RotatedMarkerOptions extends L.MarkerOptions {
  rotationAngle?: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  // subscription of ws, to unsubscribe on destroy
  subscription:any;
  // frontend
  mySidebar:any = null;
  menu:boolean = false;
  // map declaration
  private map!: L.Map;
  airplaneIcon = L.icon({
    iconUrl: '/assets/planes/icons/3.png',
    iconSize: [32, 32],
  });

  // plane array
  public planes:Array<MapPlane> = [];
  public planesMarker:Array<L.Marker> = [];
  // constructor
  constructor(private webSocketService: WebSocketService, public authService:AuthenticationService) {}


  ngOnInit(): void {
    // setting map
    this.map = L.map('map').setView([46.65, 11.3546343], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);
    // connect to ws
    this.webSocketService.connect();
    // subscribe to ws
    this.subscription = this.webSocketService.messages().subscribe(resp => {
      if (resp["Tail"]) {
        // if code is equal --> not a new plane
        const planeExists = this.planes.find(obj => obj.flightcode == resp["Tail"]);
        if (planeExists) {
          // searching index of plane in array
          const planeIndex = this.planes.findIndex(plane => plane.flightcode == resp["Tail"]);
          if (planeIndex >= 0) {
            // modify plane
            this.planes[planeIndex].timestamp = Date.now();
            this.planes[planeIndex].type = resp["Emitter_category"];
            this.planes[planeIndex].speed = resp["Speed"];
            this.planes[planeIndex].height = resp["Alt"];
            this.planes[planeIndex].track = resp["Track"];
            this.planes[planeIndex].positions.push(new MapPlanePosition(resp["Lat"], resp["Lng"]));
            this.planesMarker[planeIndex].setLatLng([resp["Lat"], resp["Lng"]]);
          }
        }
        else {
          // add new plane
          this.planes.push(
            new MapPlane(Date.now(), resp["Tail"], resp["Emitter_category"],
            resp["Speed"], resp["Alt"], resp["Track"], [new MapPlanePosition(resp["Lat"], resp["Lng"])]));
          let url:string = '/assets/planes/icons/' + resp["Emitter_category"]+".png";
          let markerOptions:RotatedMarkerOptions = {
            icon: L.icon({ iconUrl: url }),
            rotationAngle: 45
          }
          let newmarker = L.marker([46.4993342, 11.3546343], markerOptions).addTo(this.map);
          this.planesMarker.push(newmarker);
          console.log("added");
          console.log(this.planes);
        }
      }
    });
    // check every 2s if the timestamps of the planes are still vaild
    setInterval(() => this.checkPlaneTimestamps(this.planes), 2000);
  }

  private checkPlaneTimestamps(planes:Array<MapPlane>) {
    if (planes && planes.length) {
      const current = Date.now();
      // for each plane
      for (let i = 0; i < planes.length; i++) {
        // if timestamp is older than 10s
        if (current - planes[i].timestamp > 10000) {
          // remove plane
          this.planes.splice(i, 1);
          this.planesMarker[i].remove();
          console.log("removed");
          console.log(planes);
        }
      }
    }
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    this.webSocketService.close();
    this.map.remove();
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
