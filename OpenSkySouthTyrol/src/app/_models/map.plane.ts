import { MapPlanePosition } from './map.plane.position';
export class MapPlane {

  constructor(public timestamp:number, public flightcode:string,
    public type:number, public speed:number, public height:number,
    public track:number, public positions:Array<MapPlanePosition>) {}

}
