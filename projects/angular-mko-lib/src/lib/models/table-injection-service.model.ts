import { Observable } from "rxjs";
import { GridResponseInterface } from "./table-response.model";
import { GridRequestInterface } from "./table-request.model";

export interface GridInjectionService {
    /**
     * Method to retrieve data from server.
     */
    getData(filters: GridRequestInterface): Observable<GridResponseInterface>;
  }