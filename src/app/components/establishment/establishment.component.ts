import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FsaRatingsService } from '../fsa-ratings.service';
import { Establishment } from '../search-results/search-results.model';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html',
  styleUrls: ['./establishment.component.scss'],
})
export class EstablishmentComponent implements OnInit {
  FHRSID = 748698;
  // FHRSID$ = new Observable<number>();

  establishment$ = new Observable<Establishment>();

  constructor(
    private route: ActivatedRoute,
    private fsaRatingsService: FsaRatingsService
  ) {}

  ngOnInit(): void {
    this.establishment$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.FHRSID = Number(params.get('id'));
        return this.fsaRatingsService.getEstablishment(this.FHRSID);
      })
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
}
