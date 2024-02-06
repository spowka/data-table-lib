import { GridRequestInterface } from "./table-request.model";

export interface CellRendererComponent<T = any> {
    /**
     * Mandatory - Params for rendering
     */
    cellInit(params: CellRendererParams<T>): void;
}

export interface CellRendererParams<T = any> {
    /**
     * The data associated with the cell.
     */
    data: T,

    /**
     * Filters representing the current state of the grid, typically used for pagination and sort
     */
    filters: GridRequestInterface
}