import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, Subject } from 'rxjs';
import { Establishment, SearchResult } from './search-results.model';

// TODO: Replace this with your own data model type
// export interface SearchResultsItem {
//   name: string;
//   id: number;
// }

// TODO: replace this with real data from your application
// const EXAMPLE_DATA: SearchResultItem[] = [
//   {
//     FHRSID: 1014425,
//     ChangesByServerID: 0,
//     LocalAuthorityBusinessID: '249133',
//     BusinessName: 'Scrummy Pig/Crusty Cob & The Coffee & Pasty Shop',
//     BusinessType: 'Takeaway/sandwich shop',
//     BusinessTypeID: 7844,
//     AddressLine1: 'Bristol City Football Club',
//     AddressLine2: 'Ashton Road',
//     AddressLine3: 'Ashton',
//     AddressLine4: 'Bristol',
//     PostCode: 'BS3 2EJ',
//     Phone: '',
//     RatingValue: '5',
//     RatingKey: 'fhrs_5_en-gb',
//     RatingDate: '2018-01-17T00:00:00',
//     LocalAuthorityCode: '855',
//     LocalAuthorityName: 'Bristol',
//     LocalAuthorityWebSite: 'http://www.bristol.gov.uk',
//     LocalAuthorityEmailAddress: 'food.safety@bristol.gov.uk',
//     scores: {
//       Hygiene: 0,
//       Structural: 0,
//       ConfidenceInManagement: 0,
//     },
//     SchemeType: 'FHRS',
//     geocode: {
//       longitude: '-2.62102',
//       latitude: '51.439893',
//     },
//     RightToReply: '',
//     Distance: null,
//     NewRatingPending: false,
//     meta: {
//       dataSource: null,
//       extractDate: '0001-01-01T00:00:00',
//       itemCount: 0,
//       returncode: null,
//       totalCount: 0,
//       totalPages: 0,
//       pageSize: 0,
//       pageNumber: 0,
//     },
//     links: [
//       {
//         rel: 'self',
//         href: 'http://api.ratings.food.gov.uk/establishments/1014425',
//       },
//     ],
//   },
// ];

/**
 * Data source for the SearchResults view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SearchResultsDataSource extends DataSource<Establishment> {
  searchResultSubject = new Subject<SearchResult>();

  data: Establishment[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

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

          if ((next as any).establishments) {
            this.data = (next as any).establishments;
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
      switch (this.sort?.active) {
        case 'BusinessName':
          return compare(a.BusinessName, b.BusinessName, isAsc);
        case 'FHRSID':
          return compare(+a.FHRSID, +b.FHRSID, isAsc);
        case 'RatingValue':
          return compare(+a.RatingValue, +b.RatingValue, isAsc);
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
