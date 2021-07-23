import { Component, OnInit } from '@angular/core';
import { SearchOptions } from '../search-form/search-form.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  private _searchOptions: SearchOptions = {
    businessName: '',
    address: '',
    sortOptionKey: 'alpha',
  };

  set searchOptions(nextValue: SearchOptions) {
    this._searchOptions = nextValue;
  }

  get searchOptions() {
    return this._searchOptions;
  }
  constructor() {}

  ngOnInit(): void {}

  onSearchOptionsChanged(event: SearchOptions) {
    console.warn(`onSearchOptionsChanged : event = [${JSON.stringify(event)}]`);

    this.searchOptions = event;
  }
}
