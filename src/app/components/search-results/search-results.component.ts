import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { FsaRatingsService } from '../fsa-ratings.service';
import { SearchOptions } from '../search-form/search-form.component';
import {
  SearchResultsDataSource /*, SearchResultsItem */,
} from './search-results-datasource';
import { Establishment, SearchResult } from './search-results.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements AfterViewInit {
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatTable) table!: MatTable<Establishment>;
  dataSource: SearchResultsDataSource;

  getSearchResultsSubscription?: Subscription;

  private _searchOptions: SearchOptions = {
    businessName: 'steak',
    address: 'Bristol',
    sortOptionKey: 'alpha',
  };

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
        nextValue.sortOptionKey || ''
      )
      .subscribe(
        (result) => {
          this.dataSource.searchResultSubject.next(result);
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
  displayedColumns = ['FHRSID', 'BusinessName', 'PostCode', 'RatingValue'];

  constructor(private fsaRatingsService: FsaRatingsService) {
    this.dataSource = new SearchResultsDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
