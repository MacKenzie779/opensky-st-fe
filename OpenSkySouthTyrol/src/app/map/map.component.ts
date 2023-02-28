import { AuthenticationService } from './../_services/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '@app/_services/web-socket.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  subscription:any;
  mySidebar:any = null;
  menu:boolean = false;
  private map!: L.Map;
  airplaneIcon = L.icon({
    iconUrl: '/assets/planes/icons/3.png',
    iconSize: [32, 32],
  });

  constructor(private webSocketService: WebSocketService, public authService:AuthenticationService) {}


  ngOnInit(): void {
    this.map = L.map('map').setView([46.65, 11.3546343], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);
    const airplaneMarker = L.marker([46.4993342, 11.3546343], { icon: this.airplaneIcon }).addTo(this.map);
    this.webSocketService.connect();
    // this.subscription = this.webSocketService.messages().subscribe(message => {
    //   console.log(message);
    // });
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
