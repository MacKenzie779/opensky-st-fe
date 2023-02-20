import { SkyalpsService } from './../_services/skyalps.service';
import { AuthenticationService } from './../_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ObjectSkyalps } from '@app/_models/object_skyalps';

@Component({
  selector: 'app-departures',
  templateUrl: './departures.component.html',
  styleUrls: ['./departures.component.scss']
})
export class DeparturesComponent implements OnInit {

  mySidebar:any = null;
  menu:boolean = false;
  data:ObjectSkyalps[] = [];

  constructor(public authService:AuthenticationService, private skyalps:SkyalpsService) {
  }

  ngOnInit(): void {
    let arr;
    this.skyalps.getDataAsObjectArray().subscribe(data => {
      arr = data;
      this.data = arr.sort((a,b)=> {
        return new Date(a.rawdata.date).getTime() - new Date(b.rawdata.date).getTime();
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
