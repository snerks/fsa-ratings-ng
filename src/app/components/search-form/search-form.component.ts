import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { sortOptionsResponse } from './sort-options.model';
import { Ratings } from 'src/app/models/ratings-model';

export interface SearchOptions {
  businessName?: string;
  address?: string;

  ratingOperator?: string;

  ratingKeyName?: string;

  sortOptionKey?: string;
}

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  @Output()
  searchOptionsChanged: EventEmitter<SearchOptions> = new EventEmitter<SearchOptions>();

  ratings = Ratings;

  ratingOperator = 'Equal';

  ratingOperators = ['LessThanOrEqual', 'GreaterThanOrEqual', 'Equal'];

  searchForm = this.fb.group({
    businessName: null,
    address: 'bristol',
    ratingOperator: 'Equal',
    ratingKeyName: '5',
    sortOptionKey: 'alpha',
    // address: [null, Validators.required],
    // address2: null,
    // city: [null, Validators.required],
    // state: [null, Validators.required],
    // postalCode: [null, Validators.compose([
    //   Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    // ],
    // shipping: ['free', Validators.required]
  });

  sortOptions = sortOptionsResponse.sortOptions;

  hasUnitNumber = false;

  states = [
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'American Samoa', abbreviation: 'AS' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'District Of Columbia', abbreviation: 'DC' },
    { name: 'Federated States Of Micronesia', abbreviation: 'FM' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Guam', abbreviation: 'GU' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Marshall Islands', abbreviation: 'MH' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Northern Mariana Islands', abbreviation: 'MP' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Palau', abbreviation: 'PW' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Puerto Rico', abbreviation: 'PR' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virgin Islands', abbreviation: 'VI' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' },
  ];

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
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
