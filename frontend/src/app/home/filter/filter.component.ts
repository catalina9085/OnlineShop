import {Component, input, model, output, signal} from '@angular/core';
import {FilterModel} from '../../shared/domain/filter.model';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';
import {MatFormField, MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {CategoryModel} from '../../shared/domain/category.model';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatNavList} from '@angular/material/list';
import {SidenavComponent} from '../../shared/components/sidenav/sidenav.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-filter',
  imports: [MatSelect,
    MatRadioModule,
    MatOption,
    MatButtonModule, FormsModule, MatInputModule, MatIconModule, SidenavComponent, RouterLink],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  filter=model<FilterModel>(new FilterModel());
  categories=input<CategoryModel[]>([]);
  opened=false;

  recommendationTypeChanged(value: string) {
    this.filter.set({...this.filter(),recommendationType:value,priceDirection: value!="for me" ? null : this.filter().priceDirection});
    console.log(this.filter());
  }

  resetFilters() {
    this.filter.set(new FilterModel());
    console.log(this.filter());
  }

  categoriesChanged(value: string[]) {
    this.filter.set({...this.filter(),categories:value});
    console.log(this.filter());
  }

  priceDirectionChanged(value: string) {
    this.filter.set({...this.filter(),priceDirection:value,
      recommendationType: this.filter().recommendationType!="for me" ? null : "for me"});
    console.log(this.filter());
  }

  searchKeywordChanged(value: string) {
    this.filter.set({...this.filter(),searchKeyword:value});
    console.log(this.filter());
  }
}
