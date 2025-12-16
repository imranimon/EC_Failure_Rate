import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompCategory, CompType, Environment, CalculatorRequest, CalculatorResponse } from '../../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {
  
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CompCategory[]> {
    return this.http.get<CompCategory[]>(`${this.baseUrl}/categories/`);
  }

  getComponentTypes(categoryId: number): Observable<CompType[]> {
    return this.http.get<CompType[]>(`${this.baseUrl}/component-types/?categoryId=${categoryId}`);
  }

  getEnvironments(): Observable<Environment[]> {
    return this.http.get<Environment[]>(`${this.baseUrl}/environments/`);
  }

  calculateFailureRate(payload: CalculatorRequest): Observable<CalculatorResponse> {
    return this.http.post<CalculatorResponse>(`${this.baseUrl}/calculate/`, payload);
  }


  addComponentType(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/component-types/`, data);
  }

  updateComponentType(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/component-types/${id}/`, data);
  }

  deleteComponentType(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/component-types/${id}/`);
  }

  updateEnvironment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/environments/${id}/`, data);
  }
}