

export interface GridResponseInterface {
    /**
     * An array containing the data for the current page.
     */
    data: any[];

    /**
     * The index of the first item on the current page.
     */
    first: number;

    /**
     * The total number of items across all pages.
     */
    items: number;

    /**
     * The index of the last item on the current page.
     */
    last: number;

    /**
     * The index of the next page.
     */
    next: number;

    /**
     * The total number of pages.
     */
    pages: number;

    /**
     * The index of the previous page.
     */
    prev: number;
}