import { Component } from '@angular/core';
import { ObjectSkyalps } from '@app/_models/object_skyalps';
import { AuthenticationService } from '@app/_services/authentication.service';
import { SkyalpsService } from '@app/_services/skyalps.service';

@Component({
  selector: 'app-historic-departures',
  templateUrl: './historic-departures.component.html',
  styleUrls: ['./historic-departures.component.scss']
})
export class HistoricDeparturesComponent {
  mySidebar:any = null;
  menu:boolean = false;
  results:number = 10;
  private arrival_cache:ObjectSkyalps[] = [];
  private departure_cache:ObjectSkyalps[] = [];
  arrival:ObjectSkyalps[] = [];
  departure:ObjectSkyalps[] = [];

  constructor(public authService:AuthenticationService, private skyalps:SkyalpsService) {
  }

  ngOnInit(): void {
    let arr;
    this.skyalps.getDataAsObjectArray().subscribe(data => {
      arr = data;
      let sorted = arr.sort((a,b)=> {
        return new Date(b.rawdata.date+"T"+b.rawdata.time).getTime() - new Date(a.rawdata.date+"T"+a.rawdata.time).getTime();
      });
      let sheduled = sorted.filter((v) => this.filterDate(v, false));
      this.arrival_cache = sheduled.filter((v) => {return v.rawdata.type == "ARRIVAL"});
      this.convertTime(this.arrival_cache);
      this.departure_cache = sheduled.filter((v) => {return v.rawdata.type == "DEPARTURE"});
      this.convertTime(this.departure_cache);
      this.loadResults();
    });
  }

  loadResults() {
    if (this.results != 0) {
      this.arrival = this.arrival_cache.slice(0, this.results);
      this.departure = this.departure_cache.slice(0, this.results);
    }
    else {
      this.arrival = this.arrival_cache;
      this.departure = this.departure_cache;
    }
  }

  convertTime(arr:ObjectSkyalps[]) {
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      let time = new Date(arr[i].rawdata.date+"T"+arr[i].rawdata.time);
      time.setHours(time.getHours()+1);
      const options:Intl.DateTimeFormatOptions = { hour12: false, timeStyle: 'short' };
      arr[i].rawdata.time = time.toLocaleTimeString([], options);
    }
  }

  filterDate(v:ObjectSkyalps, sheduled:boolean) {
    let objecttime = new Date(v.rawdata.date+"T"+v.rawdata.time);
    let realtime = new Date();
    if (sheduled) {
      return objecttime.getTime() >= realtime.getTime();
    }
    else {
      return objecttime.getTime() < realtime.getTime();
    }
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
