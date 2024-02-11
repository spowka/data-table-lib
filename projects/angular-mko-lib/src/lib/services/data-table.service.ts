import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { GridInjectionService, GridRequestInterface } from '../models';
import { GridResponseInterface } from '../models/table-response.model';
import { convertGridRequestToParams } from '../helpers/uri-component.helper';

@Injectable()
export class DataTableService {
  private _tokenService: GridInjectionService;

  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loading$: Observable<boolean> = this._loading$.asObservable();


  constructor(private router: Router, private route: ActivatedRoute) { }

  /**
   * Fetches data from the server using the provided token and grid filters.
   * Persists the applied filter parameters
   * @param {GridRequestInterface} filters - Grid filters representing the current state.
   * @returns {Observable<GridResponseInterface>} Observable emitting the response containing the retrieved data.
   */
  public fetchData(params: GridRequestInterface): Observable<GridResponseInterface> {
    this._loading$.next(true);

    return this._tokenService.getData(params)
      .pipe(
        tap(() => this.storeFilterParams(params)),
        finalize(() => this._loading$.next(false))
      )
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
   * @param {GridInjectionService} token - The token to be set for data fetching.
   */
  public setTokenService(token: GridInjectionService) {
    this._tokenService = token;
  }

  /**
   * Stores filter parameters as query parameters in the browser's address bar.
   * Converts the provided HttpParams into a key-value object
   * @param {HttpParams} params - HTTP parameters representing the current grid filters.
   * @private
   */
  private storeFilterParams(params: GridRequestInterface) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: convertGridRequestToParams(params),
    });
  }
}
