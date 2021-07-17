import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['FHRSID', 'BusinessName', 'RatingValue'];

  constructor(private httpClient: HttpClient) {
    this.dataSource = new SearchResultsDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.getSearchResult().subscribe(
      (result) => {
        this.dataSource.searchResultSubject.next(result);
      },
      (err) => {
        console.error((err as any).message);
      }
    );
  }

  getSearchResult() {
    // now returns an Observable of Config
    return this.httpClient.get<SearchResult>(
      'https://api.ratings.food.gov.uk/Establishments?address=bristol&pageSize=100',
      {
        headers: {
          'x-api-version': '2',
        },
      }
    );
  }
}
