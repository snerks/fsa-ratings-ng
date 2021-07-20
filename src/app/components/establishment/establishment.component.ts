import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Rating } from 'src/app/models/ratings-model';
import {
  ScoreDescriptor,
  ScoreDescriptors,
} from 'src/app/models/score-descriptors.model';
import { FsaRatingsService } from '../fsa-ratings.service';
import { formatRatingValue } from '../rating-utils';
import { Establishment } from '../search-results/search-results.model';

interface ScoreItem {
  category: string;
  score: number;
  description: string;
}

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html',
  styleUrls: ['./establishment.component.scss'],
})
export class EstablishmentComponent implements OnInit, OnDestroy {
  FHRSID = 748698;
  // FHRSID$ = new Observable<number>();

  establishment$ = new Observable<Establishment>();

  ratings: Rating[] = [];
  ratingsSubscription = Subscription.EMPTY;

  scoreDescriptors: ScoreDescriptor[] = ScoreDescriptors;

  // scoreItems: ScoreItem[] = [];

  displayedColumns: string[] = ['category', 'score', 'description'];
  dataSource: ScoreItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private fsaRatingsService: FsaRatingsService
  ) {}

  ngOnDestroy(): void {
    this.ratingsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.establishment$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.FHRSID = Number(params.get('id'));
        return this.fsaRatingsService.getEstablishment(this.FHRSID);
      }),
      tap((item) => {
        item.RatingName =
          this.ratings.find((i) => i.ratingKeyName === item.RatingValue)
            ?.ratingName ?? item.RatingValue.toString();

        this.dataSource = [
          {
            category: 'Confidence',
            score: item.scores.ConfidenceInManagement || -1,
            description:
              this.getScoreDescriptor(
                'Confidence',
                item.scores.ConfidenceInManagement
              ) || '',
          },
          {
            category: 'Structural',
            score: item.scores.Structural || -1,
            description:
              this.getScoreDescriptor('Structural', item.scores.Structural) ||
              '',
          },
          {
            category: 'Hygiene',
            score: item.scores.Hygiene || -1,
            description:
              this.getScoreDescriptor('Hygiene', item.scores.Hygiene) || '',
          },
        ];
      })
    );

    this.ratingsSubscription = this.fsaRatingsService
      .getRatingsResponse()
      .subscribe(
        (next) => (this.ratings = next.ratings),
        (err) => console.error(err.message)
      );

    // this.route.queryParams.subscribe(params => {
    //   this.FHRSID = params['name'];
    // });

    // this.establishment$ = this.fsaRatingsService.getEstablishment(this.FHRSID);
  }

  getMapUrl(establishment: Establishment) {
    return `https://www.google.co.uk/maps/place/${establishment.BusinessName.replace(
      ' ',
      '+'
    )}/@${establishment.geocode.latitude},${
      establishment.geocode.longitude
    },18z`;
  }

  isNumeric(value: any) {
    return !isNaN(value);
  }

  formatRatingValueLocal(value: string | number) {
    return formatRatingValue(value);
  }

  getScoreDescriptor(scoreCategory: string, score: number | null) {
    const resultObject = this.scoreDescriptors.find(
      (i) => i.ScoreCategory === scoreCategory && i.Score === score
    );

    return resultObject?.Description
      ? resultObject?.Description
      : score?.toString();
  }

  getAddressSingleLine(establishment: Establishment) {
    const parts = [
      establishment.AddressLine1,
      establishment.AddressLine2,
      establishment.AddressLine3,
      establishment.AddressLine4,
      establishment.PostCode,
    ];

    const definedParts = parts.filter((p) => !!p);

    const result = definedParts.join(', ');

    return result;
  }
}
