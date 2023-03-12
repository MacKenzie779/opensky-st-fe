export class AirlabAirport {

  constructor(
    public country_code:string,
    public iata_code:string,
    public icao_code:string,
    public lat:number,
    public lng:number,
    public name:string
  ) {}

  public static empty() {
    return new AirlabAirport("","","",0,0,"");
  }

}
