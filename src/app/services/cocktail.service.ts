import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment} from '../../environments/environment'
import {Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CocktailService {

constructor(private http: HttpClient) { }
 
public getRandom():Observable<any>{
  return this.http.get<any>(`${environment.API_COCKTAIL}/random.php?`);
}

public findDetailCocktail(id: any): Observable<any>{
  return this.http.get<any>(`${environment.API_COCKTAIL}/lookup.php?i=${id}`);
}

public findByLetter(letter: any): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/search.php?f=${letter}`);
}

public findByName(name: string): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/search.php?s=${name}`);
}

public findByIngredient(ingredient: string): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/filter.php?i=${ingredient}`);
}

public findByCategory(category: string): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/filter.php?c=${category}`);
}

public findByAlcoholic(alcoholic: string): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/filter.php?a=${alcoholic}`);
}

public findByGlass(glass: string): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/filter.php?g=${glass}`);
}

public listCategories(): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/list.php?c=list`);
}

public listAlcoholicTypes(): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/list.php?a=list`);
}

public listGlasses(): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/list.php?g=list`);
}

public listIngredients(): Observable<any> {
  return this.http.get<any>(`${environment.API_COCKTAIL}/list.php?i=list`);
}

}
