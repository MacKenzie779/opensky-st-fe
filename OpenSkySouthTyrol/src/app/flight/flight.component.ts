import { UrlService } from './../_services/url.service';
import { AuthenticationService } from '@app/_services/authentication.service';
import { AirlabFlight } from './../_models/airlab.flight';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AirlabsService } from '@app/_services/airlabs.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

  public flight:AirlabFlight = AirlabFlight.empty();
  public imgUrl:string = "";

  mySidebar:any = null;
  menu:boolean = false;

  constructor(public as:AirlabsService, private route:ActivatedRoute, private router:Router, public authService:AuthenticationService, private us:UrlService) {}

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
          this.as.getImage(this.flight.aircraft_icao).subscribe(respImg => {
            console.log(respImg);
            this.imgUrl = respImg["data"]["result"]["items"][0]["media"];
          });
        }
      });
    });
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
