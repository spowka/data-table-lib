import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { GridRequestInterface } from '../models';
import { GridResponseInterface } from '../models/table-response.model';

@Injectable()
export class DataTableService {
  private _token$: BehaviorSubject<string> = new BehaviorSubject('');

  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loading$: Observable<boolean> = this._loading$.asObservable();

  private get token() {
    return this._token$.getValue();
  }

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  /**
   * Fetches data from the server using the provided token and grid filters.
   * Persists the applied filter parameters
   * @param {GridRequestInterface} filters - Grid filters representing the current state.
   * @returns {Observable<GridResponseInterface>} Observable emitting the response containing the retrieved data.
   */
  public fetchDataByToken(filters: GridRequestInterface): Observable<GridResponseInterface> {
    this._loading$.next(true);

    // Create filter parameters for the HTTP request.
    const params = this.createFilterParams(filters);
    return this.http.get<GridResponseInterface>(this.token, { params })
      .pipe(
        // Convert and stores filter parameters as query parameters in router
        tap(() => this.storeFilterParams(params)),
        finalize(() => this._loading$.next(false))
      );
  }

  /**
   * Experimental case.
   * Executes a callback function that returns an observable to fetch data.
   * @param {() => Observable<any[]>} callback - Callback function returning an observable to fetch data.
   * @returns {Observable<any[]>} Observable emitting the data retrieved by the callback.
   */
  public fetchDataCallback(callback: () => Observable<any[]>): Observable<any[]> {
    this._loading$.next(true);
    return callback.call(this)
      .pipe(finalize(() => this._loading$.next(false)));
  }

  /**
   * Sets the token used for fetching data in the grid.
   * @param {string} token - The token to be set for data fetching.
   */
  public setToken(token: string) {
    this._token$.next(token);
  }

  /**
   * Creates HTTP parameters based on the provided grid filters.
   * Converts grid filters into key-value pairs for HTTP request parameters.
   * @param {GridRequestInterface} filters - Grid filters representing the current state.
   * @returns {HttpParams} HTTP parameters for use in an HTTP request.
   * @private
   */
  private createFilterParams(filters: GridRequestInterface): HttpParams {
    let params = new HttpParams()
      .set('_page', filters.page)
      .set('_per_page', filters.limit);

    if (filters.order) {
      // Apply json-server syntax for sorting criteria in the HTTP parameters.
      params = params
        .set('_sort', filters.order.type === 'asc' ? filters.order.by : `-${filters.order.by}`);
    }

    return params;
  }

  /**
   * Stores filter parameters as query parameters in the browser's address bar.
   * Converts the provided HttpParams into a key-value object
   * @param {HttpParams} params - HTTP parameters representing the current grid filters.
   * @private
   */
  private storeFilterParams(params: HttpParams) {
    // Convert HttpParams to a key-value object.
    const queryParams = params.keys().reduce((object, key) => {
      object[key] = params.get(key)!
      return object
    }, {} as { [key: string]: string })

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }
}
