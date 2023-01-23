import axios from "axios";
import City from "../../domain/models/City";

const APIClient = axios.create({
  baseURL: "http://servicodados.ibge.gov.br/api/v1",
});

export async function findCityById(cityId: number): Promise<City | undefined> {
  try {
    const response = await APIClient.get(`/localidades/municipios/${cityId}`);

    if (response.data.length == 0) return;

    return City.fromJSON(response.data);
  } catch (error) {
    throw Error;
  }
}
