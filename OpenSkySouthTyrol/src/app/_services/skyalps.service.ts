import { map } from 'rxjs/operators';
import { ObjectSkyalpsRawdata } from '../_models/object_skyalps_rawdata';
import { ObjectSkyalps } from '../_models/object_skyalps';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RawSkyalps } from '@app/_models/raw_skyalps';

@Injectable({
  providedIn: 'root'
})
export class SkyalpsService {

  readonly url:string = "https://api.datapool.opendatahub.testingmachine.eu/flightdata-scheduled"

  constructor(private http:HttpClient) { }

  getDataRaw():Observable<RawSkyalps[]> {
    return this.http.get<RawSkyalps[]>(this.url);
  }

  getDataAsObjectArray(): Observable<ObjectSkyalps[]> {
    return this.getDataRaw().pipe(
      map(resp => {
        let objectArray: ObjectSkyalps[] = [];
        for (let plane of resp) {
          let rawdata = JSON.parse(plane.rawdata);
          let skyalpsRaw: ObjectSkyalpsRawdata = new ObjectSkyalpsRawdata(
            rawdata.date,
            rawdata.gate,
            rawdata.time,
            rawdata.type,
            rawdata.remark,
            rawdata.arrival,
            rawdata.company,
            rawdata.departure,
            rawdata.flight_number
          );
          let skyalps: ObjectSkyalps = new ObjectSkyalps(
            plane.id,
            plane.company,
            plane.timestamp,
            skyalpsRaw
          );
          objectArray.push(skyalps);
        }
        return objectArray;
      })
    );
  }

  // getDataAsObjectArray():ObjectSkyalps[]|undefined {
  //   let objectArray:Array<ObjectSkyalps> = [];
  //   this.getDataRaw().subscribe(resp => {
  //     for (let plane of resp) {
  //       let rawdata = JSON.parse(plane.rawdata);
  //       let skyalpsRaw:ObjectSkyalpsRawdata = new ObjectSkyalpsRawdata(
  //         rawdata.date,
  //         rawdata.gate,
  //         rawdata.time,
  //         rawdata.type,
  //         rawdata.remark,
  //         rawdata.arrival,
  //         rawdata.company,
  //         rawdata.departure,
  //         rawdata.flight_number
  //       );
  //       let skyalps:ObjectSkyalps = new ObjectSkyalps(
  //         plane.id,
  //         plane.company,
  //         plane.timestamp,
  //         skyalpsRaw
  //       );
  //       objectArray.push(skyalps);
  //     }
  //     return objectArray;
  //   });
  //   return undefined;
  // }

}
