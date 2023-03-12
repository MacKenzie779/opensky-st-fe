export class AirlabAirline {
  constructor(
    public iata_code:string,
    public icao_code:string,
    public name:string
  ) {}

  public static empty() {
    return new AirlabAirline("","","");
  }
}
