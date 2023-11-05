import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-search-bar-global',
  templateUrl: './search-bar-global.component.html',
  styleUrls: ['./search-bar-global.component.scss'],
})
export class SearchBarGlobalComponent implements OnInit {

  @ViewChild('search', {static: false}) search: IonSearchbar;

  constructor(private router: Router) { }

  ngOnInit() {}

  searchProduct(){
    this.search.getInputElement().then(input => {
      const searchValue = input.value;
      if(searchValue.length > 0){
        this.router.navigate(['/search_results/'+searchValue+'/0']);
      }
    });
  }
}
