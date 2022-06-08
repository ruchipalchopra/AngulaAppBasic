import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { item } from './item';
import { ITEMS } from './mock-items';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

@Injectable({ providedIn: 'root' })
export class ItemService {
  private itemsUrl = 'api/items';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
/** GET itemes from the server */
getitems(): Observable<item[]> {
  return this.http.get<item[]>(this.itemsUrl)
    .pipe(
      tap(_ => this.log('fetched itemes')),
      catchError(this.handleError<item[]>('getitems', []))
    );
}

/** GET item by id. Return `undefined` when id not found */
getitemNo404<Data>(id: number): Observable<item> {
  const url = `${this.itemsUrl}/?id=${id}`;
  return this.http.get<item[]>(url)
    .pipe(
      map(items => items[0]), // returns a {0|1} element array
      tap(i => {
        const outcome = i ? 'fetched' : 'did not find';
        this.log(`${outcome} item id=${id}`);
      }),
      catchError(this.handleError<item>(`getItem id=${id}`))
    );
}

/** GET item by id. Will 404 if id not found */
getitem(id: number): Observable<item> {
  const url = `${this.itemsUrl}/${id}`;
  return this.http.get<item>(url).pipe(
    tap(_ => this.log(`fetched item id=${id}`)),
    catchError(this.handleError<item>(`getitem id=${id}`))
  );
}

/* GET itemes whose name contains search term */
searchitems(term: string): Observable<item[]> {
  if (!term.trim()) {
    // if not search term, return empty item array.
    return of([]);
  }
  return this.http.get<item[]>(`${this.itemsUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found itemes matching "${term}"`) :
       this.log(`no itemes matching "${term}"`)),
    catchError(this.handleError<item[]>('searchitemes', []))
  );
}

//////// Save methods //////////

/** POST: add a new item to the server */
additem(item: item): Observable<item> {
  return this.http.post<item>(this.itemsUrl, item, this.httpOptions).pipe(
    tap((newitem: item) => this.log(`added item w/ id=${newitem.id}`)),
    catchError(this.handleError<item>('additem'))
  );
}

/** DELETE: delete the item from the server */
deleteitem(id: number): Observable<item> {
  const url = `${this.itemsUrl}/${id}`;

  return this.http.delete<item>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted item id=${id}`)),
    catchError(this.handleError<item>('deleteitem'))
  );
}

/** PUT: update the item on the server */
updateitem(item: item): Observable<any> {
  return this.http.put(this.itemsUrl, item, this.httpOptions).pipe(
    tap(_ => this.log(`updated item id=${item.id}`)),
    catchError(this.handleError<any>('updateitem'))
  );
}

/**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
  /** Log a itemService message with the MessageService */
private log(message: string) {
  this.messageService.add(`ItemService: ${message}`);
}
}