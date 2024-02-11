import { HttpErrorResponse } from "@angular/common/http";
import { GridResponseInterface } from "./table-response.model";

/**
* The response from the server is always in this format
*/
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