import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from './components/search-results/search-results.component';

const routes: Routes = [
  // { path: '', component: SearchResultsComponent }
  { path: 'search', component: SearchResultsComponent },
  // { path: 'second-component', component: SecondComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' }, // redirect to `first-component`
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
