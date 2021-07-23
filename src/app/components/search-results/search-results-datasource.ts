import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, Subject } from 'rxjs';
import { Establishment, SearchResult } from './search-results.model';
import { Rating } from 'src/app/models/ratings-model';

export type EstablishmentKeys = keyof Establishment;

/**
 * Data source for the SearchResults view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SearchResultsDataSource extends DataSource<Establishment> {
  searchResultSubject = new Subject<SearchResult>();
  ratingsSubject = new Subject<Rating[]>();

  data: Establishment[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  ratings: Rating[] = [];

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Establishment[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        // observableOf(this.data),
        this.ratingsSubject,
        this.searchResultSubject,
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map((next) => {
          // return this.getPagedData(this.getSortedData([...this.data]));

          // if (results) {

          // }

          // if (!next) {
          //   return;
          // }

          if (Array.isArray(next as any)) {
            this.ratings = next as Rating[];
          }

          if ((next as any).establishments) {
            const transformedEstablishments = (next as any)
              .establishments as Establishment[];

            transformedEstablishments.forEach((item) => {
              item.RatingName =
                this.ratings.find((i) => i.ratingKeyName === item.RatingValue)
                  ?.ratingName ?? item.RatingValue.toString();
            });

            this.data = transformedEstablishments;
          }
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Establishment[]): Establishment[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Establishment[]): Establishment[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';

      const activeSortKey = this.sort?.active ?? 'BusinessName';
      const establishmentKey: EstablishmentKeys =
        activeSortKey as EstablishmentKeys;

      // switch (this.sort?.active) {
      switch (establishmentKey) {
        case 'BusinessName':
          return compare(a.BusinessName, b.BusinessName, isAsc);
        case 'FHRSID':
          return compare(a.FHRSID, b.FHRSID, isAsc);
        case 'RatingName':
          return compare(a.RatingName, b.RatingName, isAsc);
        case 'PostCode':
          return compare(a.PostCode, b.PostCode, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
