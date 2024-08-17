import { Component, OnInit, HostBinding } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  userInfo: any = null;
  focusedNavItem: number = 0;
  navItems: any[] = [
    { name: "Dashboard", icon: 'dashboard', url: '/home/dashboard' },
    { name: "Vehicles", icon: 'account_balance', url: '/home/vehicles' },
  ];

  searchControl = new FormControl('');
  searchResults: any[] = [];

  @HostBinding('class') className = '';

  constructor(private router: Router, private api: ApiService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeRoute(this.router.url);
      }
    });
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    console.log(this.userInfo);

    const body = { page: 1, limit: 10, sort: 'dateCreated', order: 'asc', filter: '' };

    this.searchControl.valueChanges.pipe(
      debounceTime(300),  // Delay the search to avoid triggering on every keystroke
      distinctUntilChanged(),  // Ignore duplicate values
      switchMap(query => this.api.post('/search_vehicles', {...body, search: query}))  // Fetch filtered data from the API
    ).subscribe(
      {
        next: (data: any) => {
          if (data) {
            console.log('RESULTS',data)
          }
        },
        error: err => console.log(err)
      }
    );
  }

  changeRoute(url: string) {
    this.navItems.forEach((item, i) => {
      if (item.url === url) {
        this.focusedNavItem = i;
        this.router.navigate([url]);
      }
    });
  }
}
