import { InjectionToken } from "@angular/core";
import { GridInjectionService } from "./table-injection-service.model";

export interface GridApi {
  /**
   * Retrieves data for the data grid.
   * @param {InjectionToken<GridInjectionService>} token - An optional GridInjectionService token to set or replace for data retrieval.
   */
  getData(token?: InjectionToken<GridInjectionService>): void;
}
