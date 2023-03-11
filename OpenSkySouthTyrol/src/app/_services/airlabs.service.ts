import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AirlabsService {

  readonly API_KEY = "8bd5cfd7-139e-4911-87e5-3630b326f1da"

  constructor(private http:HttpClient) {}

  getFlight(code:string) {
    return this.http.get<any>("https://airlabs.co/api/v9/flights?api_key="+this.API_KEY+"&flight_icao="+code);
  }

  getImage(searchTerm:string) {
    let params = {
      'count': 1,
      'q': searchTerm,
      't': 'images',
      'safesearch': 1,
      'locale': 'en_US',
      'offset': 0,
      'device': 'desktop'
    };
    return this.http.get<any>("https://api.qwant.com/v3/search/images", {params:params});
  }

  getAirports() {
  }

}
