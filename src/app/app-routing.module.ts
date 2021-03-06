import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstablishmentComponent } from './components/establishment/establishment.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  // { path: '', component: SearchResultsComponent }
  { path: 'search', component: SearchComponent },
  { path: 'establishment/:id', component: EstablishmentComponent },
  // { path: 'second-component', component: SecondComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' }, // redirect to `first-component`
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
