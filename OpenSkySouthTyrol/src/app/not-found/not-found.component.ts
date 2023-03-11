import { UrlService } from './../_services/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  mySidebar:any = null;

  constructor(private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
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
    this.route.params.subscribe(params => {
      console.log(params["redirect"]);
      if (params["redirect"]) {
        this.router.navigate(["/", params["redirect"]]);
      }
      else {
        this.router.navigate(["/dashboard"]);
      }
    });
  }
}
