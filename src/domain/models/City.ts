class City {
  stateId: number;
  state: string;
  stateAcronym: string;
  id: number;
  name: string;

  constructor(
    stateId?: number,
    state?: string,
    stateAcronym?: string,
    cityId?: number,
    city?: string
  ) {
    this.stateId = stateId || 0;
    this.state = state || "";
    this.stateAcronym = stateAcronym || "";
    this.id = cityId || 0;
    this.name = city || "";
  }

  static fromJSON(json: Record<string, any>): City {
    const city = new City();
    city.name = json.nome;
    city.id = json.id;
    city.state = json.microrregiao.mesorregiao.UF.nome;
    city.stateId = json.microrregiao.mesorregiao.UF.id;
    city.stateAcronym = json.microrregiao.mesorregiao.UF.sigla;
    return city;
  }

  toJSON(): Record<string, any> {
    const json: Record<string, any> = {};
    json.city = this.name;
    json.cityId = this.id;
    json.state = this.state;
    json.stateId = this.stateId;
    json.stateAcronym = this.stateAcronym;
    return json;
  }
}

export default City;
