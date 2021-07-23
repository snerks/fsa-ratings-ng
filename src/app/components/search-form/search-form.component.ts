import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { sortOptionsResponse } from './sort-options.model';
import { Ratings } from 'src/app/models/ratings-model';

export interface SearchOptions {
  businessName?: string;
  address?: string;

  ratingOperator?: string;

  ratingKeyName?: string;

  sortOptionKey?: string;

  maximumResultCount?: number;
}

export const defaultSearchOptions: SearchOptions = {
  businessName: '',
  address: '',
  ratingOperator: 'Equal',
  ratingKeyName: '5',
  sortOptionKey: 'alpha',
  maximumResultCount: 100,
};

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit, OnDestroy {
  @Output()
  searchOptionsChanged: EventEmitter<SearchOptions> = new EventEmitter<SearchOptions>();

  ratings = Ratings;

  ratingOperator = 'Equal';

  ratingOperators = [
    {
      value: 'LessThanOrEqual',
      displayValue: 'Less Than Or Equal',
    },
    {
      value: 'GreaterThanOrEqual',
      displayValue: 'Greater Than Or Equal',
    },
    {
      value: 'Equal',
      displayValue: 'Equal',
    },
  ];

  maximumResultCountOptions = [
    {
      value: 0,
      displayValue: 'None',
    },
    {
      value: 100,
      displayValue: '100',
    },
    {
      value: 250,
      displayValue: '250',
    },
    {
      value: 500,
      displayValue: '500',
    },
  ];

  searchForm: FormGroup = this.fb.group({});

  sortOptions = sortOptionsResponse.sortOptions;

  constructor(private fb: FormBuilder) {}
  ngOnDestroy(): void {
    const searchOptionsJson = JSON.stringify(this.searchForm.value);
    localStorage.setItem('searchOptions', searchOptionsJson);
  }

  ngOnInit(): void {
    const searchOptionsJson = localStorage.getItem('searchOptions');
    const searchOptions: SearchOptions = searchOptionsJson
      ? JSON.parse(searchOptionsJson)
      : defaultSearchOptions;

    const {
      businessName,
      address,
      ratingOperator,
      ratingKeyName,
      sortOptionKey,
      maximumResultCount,
    } = searchOptions;

    this.searchForm = this.fb.group({
      businessName,
      address,
      ratingOperator,
      ratingKeyName,
      sortOptionKey,
      maximumResultCount,
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((nextValue: SearchOptions) => {
        this.handleNextSearchOptions(nextValue);
      });

    const addressFormControl = this.searchForm.get('address');
    if (addressFormControl) {
      const value = addressFormControl.value;
      addressFormControl.setValue(value);
    }
  }

  handleNextSearchOptions(nextValue: SearchOptions) {
    console.warn(`nextValue = [${JSON.stringify(nextValue)}]`);

    const haveSearchTerms = nextValue.address || nextValue.businessName;

    if (!haveSearchTerms) {
      console.warn(`nextValue has no defined search terms - will not search`);

      return;
    }

    this.searchOptionsChanged.emit(nextValue);
  }

  onSubmit(): void {
    alert('Thanks!');
  }

  isNumericRatingKeyName() {
    const ratingKeyNameControl = this.searchForm.get('ratingKeyName');

    if (!ratingKeyNameControl) {
      return false;
    }

    const value = ratingKeyNameControl.value;

    const result = this.isNumeric(value);

    return result;
  }

  isNumeric(value: any) {
    return !isNaN(value);
  }
}
