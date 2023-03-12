export class AirlabFlight {
  constructor(
    public aircraft_icao:string,
    public airline_iata:string,
    public airline_icao:string,
    public alt:number,
    public arr_iata:string,
    public arr_icao:string,
    public dep_iata:string,
    public dep_icao:string,
    public dir: number,
    public flag:string,
    public flight_iata:string,
    public flight_icao:string,
    public flight_number:string,
    public hex: string,
    public lat:number,
    public lng:number,
    public reg_number:string,
    public speed:number,
    public squawk:string,
    public status:string,
    public updated:number,
    public v_speed:number
  ) {}

  public static empty() {
    return new AirlabFlight("","","",0,"","","","",0,"","","","","",0,0,"",0,"","",0,0);
  }
}
