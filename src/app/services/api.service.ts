import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverUrl: string = environment.serverUrl;

  constructor(private http: HttpClient) { }

  post(endpoint: string, payload: any) {
    return this.http.post(`${this.serverUrl}${endpoint}`, payload);
  }

  put(endpoint: string, payload: any) {
    return this.http.put(`${this.serverUrl}${endpoint}`, payload);
  }

  get(endpoint: string, query: any = '') {
    let url = `${this.serverUrl}${endpoint}`;

    if (query) {
      url += `?query=${query}`
    }
    return this.http.get(url);
  }

  delete(endpoint: string) {
    let url = `${this.serverUrl}${endpoint}`;

    return this.http.delete(url);
  }
}
