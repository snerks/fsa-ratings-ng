import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { BehaviorSubject, from, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rating, RatingsResponse } from '../models/ratings-model';
// import {
//   ScoreDescriptor,
//   ScoreDescriptorsResponse,
// } from '../models/score-descriptors-model';
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
  getSearchResult(
    name: string,
    address: string,
    sortOptionKey: string,
    ratingKeyName: string,
    ratingOperator: string
  ) {
    return this.httpClient.get<SearchResult>(
      `${this.baseUrl}Establishments?name=${name}&address=${encodeURIComponent(
        address
      )}&sortOptionKey=${sortOptionKey}&pageSize=100&ratingKey=${ratingKeyName}&ratingOperatorKey=${ratingOperator}`,
      this.headersOptions
    );
  }
  getEstablishment(FHRSID: number) {
    return this.httpClient.get<Establishment>(
      `${this.baseUrl}Establishments/${FHRSID}`,
      this.headersOptions
    );
  }

  // private _scoreDescriptorsResponse: ScoreDescriptorsResponse | undefined =
  //   undefined;
  // private _scoreDescriptors$ = new BehaviorSubject<ScoreDescriptor[]>([]);

  // getScoreDescriptors(FHRSID: number) {
  //   if (this._scoreDescriptorsResponse) {
  //     return this._scoreDescriptors$;
  //   }

  //   return this.httpClient
  //     .get<ScoreDescriptorsResponse>(
  //       `${this.baseUrl}Establishments/${FHRSID}`,
  //       this.headersOptions
  //     )
  //     .pipe(
  //       map((response) => {
  //         this._scoreDescriptors$.next(response.scoreDescriptors);
  //       })
  //     );
  // }

  // private _ratingsResponse: RatingsResponse | undefined =
  //   undefined;
  // private _ratings$ = new ReplaySubject<Rating[]>(1);

  getRatingsResponse() {
    return this.httpClient.get<RatingsResponse>(
      `${this.baseUrl}Ratings`,
      this.headersOptions
    );
  }

  // getRatingOperatorsResponse() {
  //   return this.httpClient.get<RatingsResponse>(
  //     `${this.baseUrl}Ratings`,
  //     this.headersOptions
  //   );
  // }
}
