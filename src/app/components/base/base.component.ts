import { Component, OnInit, HostBinding, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnChanges {
  vehicles!: any;
  vehicleSub!: Subscription;
  showSearchResults:boolean = false;

  userInfo: any = null;
  focusedNavItem: number = 0;
  navItems: any[] = [
    { name: "Dashboard", icon: 'dashboard', url: '/base/dashboard' },
    { name: "Vehicles", icon: 'garage', url: '/base/vehicles' },
  ];

  searchControl = new FormControl('');
  searchResults: any[] = [];

  @HostBinding('class') className = '';

  constructor(private router: Router, private api: ApiService, public token: TokenService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeRoute(this.router.url);
      }
    });
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

    const body = { page: 1, limit: 10, sort: 'dateCreated', order: 'asc', filter: '' };

    this.vehicleSub = this.searchControl.valueChanges.pipe(
      debounceTime(300),  // Delay the search to avoid triggering on every keystroke
      distinctUntilChanged(),  // Ignore duplicate values
      switchMap(query => this.api.post('/search_vehicles', { ...body, search: query }))  // Fetch filtered data from the API
    ).subscribe({
      next: (data: any) => {
        if (data) {
          this.vehicles = data;
          this.showSearchResults = true;

          if(!this.searchControl.value) {
            this.showSearchResults = false;
          }
        }
      },
      error: err => console.log(err)
    });
  }

  back() {
    this.searchControl.setValue('');
    this.showSearchResults = false;
  }

  changeRoute(url: string) {
    this.navItems.forEach((item, i) => {
      if (item.url === url) {
        this.focusedNavItem = i;
        this.router.navigate([url]);
      }
    });
  }

  ngOnChanges() {
    this.vehicleSub.unsubscribe();
  }
}
