import { UrlService } from './_services/url.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'OpenSkySouthTyrol';

  constructor(private url:UrlService) {}
}
