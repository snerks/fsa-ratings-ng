import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResult } from './search-results/search-results.model';

@Injectable({
  providedIn: 'root',
})
export class FsaRatingsService {
  constructor(private httpClient: HttpClient) {}

  getSearchResult(name: string, address: string, sortOptionKey: string) {
    return this.httpClient.get<SearchResult>(
      `https://api.ratings.food.gov.uk/Establishments?name=${name}&address=${encodeURIComponent(
        address
      )}&sortOptionKey=${sortOptionKey}&pageSize=100`,
      {
        headers: {
          'x-api-version': '2',
        },
      }
    );
  }
}
