import { AirlabAirline } from './../_models/airlab.airline';
import { UrlService } from './../_services/url.service';
import { AuthenticationService } from '@app/_services/authentication.service';
import { AirlabFlight } from './../_models/airlab.flight';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AirlabsService } from '@app/_services/airlabs.service';
import { AirlabAirport } from '@app/_models/airlab.airport';

import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit, AfterViewInit {

  public flight:AirlabFlight = AirlabFlight.empty();
  public dep:AirlabAirport = AirlabAirport.empty();
  public arr:AirlabAirport = AirlabAirport.empty();
  public airline:AirlabAirline = AirlabAirline.empty();
  public airportloaded:number = 0;
  public imgUrl:string = "";

  mySidebar:any = null;
  menu:boolean = false;

  // map
  @ViewChild('map', {static: false}) mapElement!: ElementRef;
  map!: L.Map;
  startMarker!: L.Marker;
  stopMarker!: L.Marker;
  flightPath!: L.Polyline;

  constructor(public as:AirlabsService, private route:ActivatedRoute, private router:Router,
    public authService:AuthenticationService, private us:UrlService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.as.getFlight(params['code']).subscribe(resp => {
        console.log(resp);
        if (resp["response"][0] == undefined) {
          let lasturl = this.us.getPreviousUrl();
          if (lasturl) {
            this.router.navigate(["/404", lasturl.substring(1)]);
          }
          else {
            this.router.navigate(["/404/dashboard"]);
          }

          console.log("not found");
        }
        else {
          resp = resp["response"][0];
          console.log(resp);
          Object.assign(this.flight, resp);
          console.log(this.flight);
          this.as.getAirport(this.flight.dep_iata).subscribe(port => {
            console.log(port);
            Object.assign(this.dep, port["response"][0]);
            console.log(this.dep);
            this.loadedAirport();
          });
          this.as.getAirport(this.flight.arr_iata).subscribe(port => {
            console.log(port);
            Object.assign(this.arr, port["response"][0]);
            console.log(this.arr);
            this.loadedAirport();
          });
          this.as.getAirline(this.flight.airline_icao).subscribe(airline => {
            console.log(airline);
            Object.assign(this.airline, airline["response"][0]);
            console.log(this.airline);
            this.as.getImage(this.airline.name+" "+this.flight.reg_number).subscribe(respImg => {
              console.log(respImg);
              this.imgUrl = respImg["data"]["result"]["items"][0]["media"];
            });
          });
        }
      });
    });
  }

  loadedAirport() {
    this.airportloaded++;
    if (this.airportloaded >= 2) {
      this.initMap();
    }
  }

  ngAfterViewInit() {
    // this.initMap();
  }


  initMap() {
    this.map = L.map(this.mapElement.nativeElement).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);

    this.startMarker = L.marker([this.dep.lat, this.dep.lng], { icon: L.icon({ iconUrl: '../../assets/airport_marker.png', iconSize: [40, 45] }) }).bindTooltip(this.dep.country_code + "<br/>" + this.dep.name + "<br/>" + this.dep.iata_code).addTo(this.map);
    this.stopMarker = L.marker([this.arr.lat, this.arr.lng], { icon: L.icon({ iconUrl: '../../assets/airport_marker.png', iconSize: [40, 45] }) }).bindTooltip(this.arr.country_code + "<br/>" + this.arr.name + "<br/>" + this.arr.iata_code).addTo(this.map);

    const latlngs = [[this.dep.lat, this.dep.lng], [this.arr.lat, this.arr.lng]];
    const latlngsObj = latlngs.map(latlng => L.latLng(latlng[0], latlng[1]));
    this.flightPath = L.polyline(latlngsObj, {color: 'red'}).addTo(this.map);

    this.map.fitBounds(this.flightPath.getBounds());
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

  back() {
    this.router.navigate([this.us.getPreviousUrl()]);
  }

}
