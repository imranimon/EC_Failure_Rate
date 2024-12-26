import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Comp, CompType} from '../../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {

  private baseUrl = 'http://127.0.0.1:8000/';
  private urlComponent = 'api/components/';
  private urlComponentType = 'api/component-types/';

  constructor(private http: HttpClient) {
  }

  private getFullUrl(url: string): string {
    return this.baseUrl + url;
  }

  getComponents(): Observable<Comp[]> {
    const fullUrl = this.getFullUrl(this.urlComponent);
    return this.http.get<Comp[]>(fullUrl);
  }

  getComponentType(id: number): Observable<CompType[]> {
    const url = this.urlComponentType + `?comId=${id}`;
    const fullUrl = this.getFullUrl(url);
    return this.http.get<CompType[]>(fullUrl);
  }

}
