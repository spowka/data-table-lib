import { HttpErrorResponse } from "@angular/common/http";

/**
* The response from the server is always in this format
*/
interface GridResponseInterface<T = any> {
    total: number;
    results: Array<T>;
    page: number;
}

export interface ClickByRowEventInterface<T = any> {
    id: string; // Table ID
    data: T;
}

export interface UpdatedEventInterface<T = GridResponseInterface> {
    id: string; // Table ID
    data: T;
}

export interface EmptyEventInterface {
    id: string; // Table ID
}

export interface ErrorEventInterface {
    id: string; // Table ID
    error: HttpErrorResponse;
}