import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HERO } from './mocke-hero';
import { Observable, of, VirtualTimeScheduler } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = "api/heroes"

  constructor(private messageService: MessageService, private http : HttpClient) { }

  getHeroes(): Observable<Hero[]>{
    // const heroes = of(HERO);
    // this.messageService.add("HeroService : fetched heroes")
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(tap(_ => this.log("fetched heroes")),catchError(this.handleError<Hero[]>("getHeroes", [])))

    // return heroes;
  }

  getHero(id: Number):Observable<Hero>{
    // const hero = HERO.find(hero => hero.id === id)!;
    // this.messageService.add(`Hero Service: fetched hero ${id}`);
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(tap(_=>this.log(`fetched hero ${id}`)), catchError(this.handleError<Hero>(`getHero ${id}`)))
  }

  private log(message: String){
    this.messageService.add(`Hero Service: ${message}`)
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
   console.error(error); // log to console instead
  
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

updateHero(hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}
/** PUT: update the hero on the server */
httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

addHero(hero: Hero):Observable<Hero>{
  return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)), catchError(this.handleError<Hero>('addHero')))
}

deleteHero(id:number):Observable<Hero>{
  const url = `${this.heroesUrl}/${id}`;
  return this.http.delete<Hero>(url, this.httpOptions).pipe(tap(_=> this.log(`deleted hero ${id}`)), catchError(this.handleError<Hero>("delete hero")));
  
}

searchHeroes(term: String):Observable<Hero[]>{
  if(!term.trim()){
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(tap(x => x.length? this.log(`found heroes matching "${term}"`) :
  this.log(`no heroes matching "${term}"`)),catchError(this.handleError<Hero[]>("searchHeroes", [])))
}
}
