import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output, OnInit, OnDestroy, EventEmitter, InjectionToken, Injector } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Event, Router, RoutesRecognized } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, filter, map, take } from 'rxjs';

import { DataTableService } from '../../services/data-table.service';
import { TableInstancesService } from './services/table-instances.service';
import { CellRendererDirective } from '../../directives/cell-renderer.directive';
import { PaginationComponent } from './components/pagination/pagination.component';

import {
  ClickByRowEventInterface,
  EmptyEventInterface,
  ErrorEventInterface,
  GridApi,
  GridInjectionService,
  GridRequestInterface,
  UpdatedEventInterface
} from '../../models';
import { ColumnPropertiesInterface } from '../../models/column-properties.model';
import { GridResponseInterface } from '../../models/table-response.model';
import { PaginationValue } from './components/pagination/models/pagination-value.model';
import { convertParamsToGridRequest } from '../../helpers/uri-component.helper';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    CellRendererDirective,
    PaginationComponent
  ],
  providers: [DataTableService],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnInit, OnDestroy {
  @Input() token?: InjectionToken<GridInjectionService>;

  @Input() autoLoading: boolean;
  @Input() messageNotFound: string;
  @Input() messagePending: string;
  @Input() header: string;

  @Input() columns: ColumnPropertiesInterface[] = [];

  @Output() onGridReady: EventEmitter<GridApi> = new EventEmitter();
  @Output() onClickByRowEvent: EventEmitter<ClickByRowEventInterface> = new EventEmitter();
  @Output() onEmptyEvent: EventEmitter<EmptyEventInterface> = new EventEmitter();
  @Output() onUpdatedEvent: EventEmitter<UpdatedEventInterface> = new EventEmitter();
  @Output() onErrorEvent: EventEmitter<ErrorEventInterface> = new EventEmitter();

  public tableId: string;

  public loading$: Observable<boolean>
  public dataSource: any[] = [];
  public dataSourceColumns: string[] = [];

  public filters: GridRequestInterface;
  public paginationTotal: number;

  constructor(
    private tableService: DataTableService,
    private cd: ChangeDetectorRef,
    private tableInstances: TableInstancesService,
    private router: Router,
    private injector: Injector,
  ) {
    this.loading$ = this.tableService.loading$;
    this.filters = { page: 1, limit: 10 };

    // Increments the instance count when a new table is created.
    this.tableInstances.increment();
  }

  ngOnInit(): void {
    // Callback executed after receiving and converting query parameters
    this.loadFilterParams().subscribe(filters => {
      if (filters) {
        this.filters = filters;
      }

      if (this.token) {
        // Store the provided token in the associated table service.
        this.tableService.setTokenService(this.injectTokenService(this.token));

        if (this.autoLoading) {
          this.fetchData();
        };
      }

      // Initialize the table API after handling filters and the token.
      this.initTableOptions();
    });
  }

  /**
   * Callback method triggered when the pagination values change.
   * @param {PaginationValue} event - The event containing the new page and limit values.
   */
  public onPageChange(event: PaginationValue): void {
    this.filters.page = event.page;
    this.filters.limit = event.limit;

    this.fetchData();
  }

  /**
   * Callback method triggered when a cell header is clicked.
   * Handles sorting logic for the specified property name.
   * @param {string} propName - The name of the property whose header was clicked.
   */
  public onCellHeaderClicked(propName: string) {
    if (this.filters.order?.by === propName) {
      if (this.filters.order.type === 'desc') {
        delete this.filters.order;
      } else {
        this.filters.order.type = 'desc';
      }
    } else {
      this.filters.order = {
        by: propName,
        type: 'asc'
      }
    }

    this.fetchData();
  }

  /**
   * Callback method triggered when a row is clicked in the table.
   * @param {any} data - The data associated with the clicked row.
   */
  public onRowClicked(data: any) {
    this.onClickByRowEvent.emit({ id: this.tableId, data })
  }

  /**
 * Fetches data using the provided filters.
 * Handles the response by updating pagination total and initializing the data source.
 * @private
 */
  private fetchData() {
    this.tableService.fetchData(this.filters)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (response: GridResponseInterface) => {
          this.paginationTotal = response.total;
          this.initDataSource(response.results);
        },
        error: this.handleError.bind(this)
      });
  }

  /**
   * Initializes the data source for the table with the provided data.
   * @param {any[]} dataSource - The data to be set as the data source for the table.
   * @private
   */
  private initDataSource(dataSource: any[]): void {
    this.dataSource = dataSource;
    // Extract column names the data source.
    this.dataSourceColumns = Object.keys(dataSource.at(0));
    this.cd.markForCheck();

    if (!this.dataSource.length) {
      return this.onEmptyEvent.emit({ id: this.tableId });
    }

    this.onUpdatedEvent.emit({
      id: this.tableId, data: {
        total: this.paginationTotal,
        results: this.dataSource,
        page: this.filters.page
      }
    })
  }

  /**
   * Load filter parameters from the current route's query parameters.
   * Note: This method is designed to work with JSON-Server syntax, where query parameters
   * use underlined keys (e.g., '_page', '_per_page', '_sort').
   * @returns {Observable<GridRequestInterface | null>} Observable emitting filter parameters or null.
   */
  private loadFilterParams(): Observable<GridRequestInterface | null> {
    return this.router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        take(1),
        map((event: Event) => {
          const params = (event as RoutesRecognized).state.root.queryParams;

          if (Boolean(Object.keys(params).length)) {
            return convertParamsToGridRequest(params);
          }

          // Return null if no query parameters are found.
          return null;
        })
      )
  }

  /**
   * Injects and retrieves an instance of GridInjectionService using Angular's dependency injection system.
   * This function is intended to be used for injecting services that are identified by an InjectionToken.
   * @returns An instance of GridInjectionService obtained from the Angular injector.
   * @throws If the injection token (this.token) does not correspond to a valid provider.
   */
  private injectTokenService(token: InjectionToken<GridInjectionService>): GridInjectionService {
    return this.injector.get(token);
  }

  /**
   * Handles HTTP errors by emitting an error event containing the table ID and the error details.
   * @param {HttpErrorResponse} error - The HTTP error response.
   * @private
   */
  private handleError(error: HttpErrorResponse) {
    this.onErrorEvent.emit({ id: this.tableId, error })
  }

  /**
   * Initializes table options, assigns a unique table ID, and emits a GridApi instance.
   * The unique table ID is generated based on the count of table instances.
   * Emits the onGridReady event with a GridApi instance, allowing external components to interact with the table.
   * @private
   */
  private initTableOptions() {
    this.tableId = `table-${this.tableInstances.getCount()}`;

    const gridApi: GridApi = {
      getData: (token?: InjectionToken<GridInjectionService>) => {
        if (token) {
          this.tableService.setTokenService(this.injectTokenService(token));
        }

        this.fetchData();
      },
    };

    this.onGridReady.emit(gridApi);
  }

  ngOnDestroy(): void {
    this.tableInstances.decrement();
  }
}
