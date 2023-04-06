import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(this.apiUrl);
  
  }
  
  deleteUser(id : number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  addUser(data: any): Observable<any> {
    console.log('jos')
    return this.http.post(this.apiUrl, data);
  }


  updateUser(id : number, data : any){
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, data);
  }
  getUserById(id : number){
    const url = `${this.apiUrl}/${id}`;
    return this.http.get(url);
  }
}
