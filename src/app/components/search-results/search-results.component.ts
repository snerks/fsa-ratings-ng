import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { FsaRatingsService } from '../fsa-ratings.service';
import { formatRatingValue } from '../rating-utils';
import { SearchOptions } from '../search-form/search-form.component';
import {
  EstablishmentKeys,
  SearchResultsDataSource /*, SearchResultsItem */,
} from './search-results-datasource';
import { Establishment, SearchResult } from './search-results.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatTable) table!: MatTable<Establishment>;
  dataSource: SearchResultsDataSource;

  getSearchResultsSubscription = Subscription.EMPTY;
  getRatingsResponseSubscription = Subscription.EMPTY;

  private _searchOptions: SearchOptions = {
    businessName: '',
    address: '',
    sortOptionKey: 'alpha',
  };
  totalSearchResultCount: number | undefined = undefined;
  maximumResultCount: number | undefined = undefined;

  @Input()
  set searchOptions(nextValue: SearchOptions) {
    this._searchOptions = nextValue;

    if (this.getSearchResultsSubscription) {
      this.getSearchResultsSubscription.unsubscribe();
    }

    this.getSearchResultsSubscription = this.fsaRatingsService
      .getSearchResult(
        nextValue.businessName || '',
        nextValue.address || '',
        nextValue.sortOptionKey || '',
        nextValue.ratingKeyName || '',
        nextValue.ratingOperator || 'Equal',
        nextValue.maximumResultCount
      )
      .subscribe(
        (result) => {
          this.paginator.pageIndex = 0;
          this.dataSource.searchResultSubject.next(result);
          this.totalSearchResultCount = result.meta.totalCount;
          this.maximumResultCount = nextValue.maximumResultCount;
        },
        (err) => {
          console.error((err as any).message);
        }
      );
  }

  get searchOptions() {
    return this._searchOptions;
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    // 'FHRSID',
    'BusinessName',
    'PostCode',
    // 'RatingValue',
    'RatingName',
    'Details',
  ];

  constructor(private fsaRatingsService: FsaRatingsService) {
    this.dataSource = new SearchResultsDataSource();
  }

  ngOnInit(): void {
    this.getRatingsResponseSubscription = this.fsaRatingsService
      .getRatingsResponse()
      .subscribe({
        next: (result) => {
          this.dataSource.ratingsSubject.next(result.ratings);
        },
        error: (err) => {
          console.error((err as any).message);
        },
      });
  }

  ngOnDestroy(): void {
    this.getSearchResultsSubscription.unsubscribe();
    this.getRatingsResponseSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  formatRatingValueLocal(value: string | number) {
    return formatRatingValue(value);
  }
}
