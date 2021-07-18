import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Establishment,
  SearchResult,
} from './search-results/search-results.model';

@Injectable({
  providedIn: 'root',
})
export class FsaRatingsService {
  constructor(private httpClient: HttpClient) {}

  baseUrl = 'https://api.ratings.food.gov.uk/';

  headersOptions = {
    headers: {
      'x-api-version': '2',
    },
  };
  getSearchResult(name: string, address: string, sortOptionKey: string) {
    return this.httpClient.get<SearchResult>(
      `${this.baseUrl}Establishments?name=${name}&address=${encodeURIComponent(
        address
      )}&sortOptionKey=${sortOptionKey}&pageSize=100`,
      this.headersOptions
    );
  }

  getEstablishment(FHRSID: number) {
    return this.httpClient.get<Establishment>(
      `${this.baseUrl}Establishments/${FHRSID}`,
      this.headersOptions
    );
  }
}
