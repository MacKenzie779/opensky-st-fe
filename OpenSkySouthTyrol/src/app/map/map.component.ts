import { Router } from '@angular/router';
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

  // plane array
  public planes:Array<MapPlane> = [];
  public planesMarker: Record<string, L.Marker> = {};
  public linesMarker: Record<string, L.Polyline> = {};

  // public planesMarker:Array<L.Marker> = [];
  // constructor
  constructor(private webSocketService: WebSocketService, public authService:AuthenticationService, private router:Router) {}


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
            // update marker with track and
            this.planesMarker[resp["Tail"]].remove();
            delete this.planesMarker[resp["Tail"]];
            // this.planesMarker[resp["Tail"]].setLatLng([resp["Lat"], resp["Lng"]]);
            let url:string = '/assets/planes/icons/' + resp["Emitter_category"]+".png";
            let markerOptions:RotatedMarkerOptions = {
              icon: L.icon({ iconUrl: url }),
              rotationAngle: resp["Track"],
            }
            let newmarker = L.marker([resp["Lat"], resp["Lng"]], markerOptions)
              .bindTooltip(resp["Tail"] + "<br/>" + (resp["Speed"] * 1.852).toFixed(2) + " km/h" + "<br/>" + (resp["Alt"] * 0.000305).toFixed(2) + " km",
              ).addTo(this.map);
            let urlparam:string = resp["Tail"];
            urlparam = urlparam.replaceAll(" ", "");
            newmarker.on('click', () => {
              this.router.navigate(['/flight', urlparam]);
            });
            this.planesMarker[resp["Tail"]] = newmarker;
            // lines marker update
            // if (this.linesMarker[resp["Tail"]]) {
            //   this.map.removeLayer(this.linesMarker[resp["Tail"]]);
              // this.linesMarker[resp["Tail"]].remove();
            //   delete this.linesMarker[resp["Tail"]];
            //   console.log("exists");
            // }
            // const latLngs = this.planes[planeIndex].positions.map(position => L.latLng(position.latitude, position.longitude));
            // this.linesMarker[resp["Tail"]] = L.polyline(latLngs, {color: 'blue'}).addTo(this.map);
          }
        }
        else {
          // add new plane
          this.planes.push(
            new MapPlane(Date.now(), resp["Tail"], resp["Emitter_category"],
            resp["Speed"], resp["Alt"], resp["Track"], [new MapPlanePosition(resp["Lat"], resp["Lng"])]));
          let url:string = '/assets/planes/icons/' + resp["Emitter_category"]+".png";
          let markerOptions:RotatedMarkerOptions = {
            icon: L.icon({ iconUrl: url, iconSize: [32,32] }),
            rotationAngle: resp["Track"]
          }
          let newmarker = L.marker([resp["Lat"], resp["Lng"]], markerOptions)
          .bindTooltip(resp["Tail"] + "<br/>" + (resp["Speed"] * 1.852).toFixed(2) + " km/h" + "<br/>" + (resp["Alt"] * 0.000305).toFixed(2) + " km",
          ).addTo(this.map);
          let urlparam = resp["Tail"];
          urlparam = urlparam.replace(" ", "");
          newmarker.on('click', () => {
            this.router.navigate(['/flight', urlparam]);
          });
          this.planesMarker[resp["Tail"]] = newmarker;
          // const latLngs = this.planes[resp["Tail"]].positions.map(position => L.latLng(position.latitude, position.longitude));
          // let linemarker = L.polyline(latLngs, {color: 'blue'}).addTo(this.map);
          // this.linesMarker[resp["Tail"]] = linemarker;
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
        if (current - planes[i].timestamp > 20000) {
          // remove plane
          // this.map.removeLayer(this.linesMarker[this.planes[i].flightcode]);
          // delete this.linesMarker[this.planes[i].flightcode];
          this.planesMarker[this.planes[i].flightcode].remove();
          delete this.planesMarker[this.planes[i].flightcode];
          this.planes.splice(i, 1);
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
