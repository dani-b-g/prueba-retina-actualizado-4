import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon/ditto'; // URL de la API

  constructor(private http: HttpClient) { }

  // Método que realiza la llamada GET
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
