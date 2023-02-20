import { ObjectSkyalpsRawdata } from './object_skyalps_rawdata';
export class ObjectSkyalps {
  constructor(public id:string, public company:string, public timestamp:string, public rawdata:ObjectSkyalpsRawdata){}
}
