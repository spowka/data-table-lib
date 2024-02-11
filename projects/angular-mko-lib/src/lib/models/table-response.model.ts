export interface GridResponseInterface<T = any> {
    /**
     * The total number of items across all pages.
     */
    total: number;
    /**
     * An array containing the data for the current page.
     */
    results: Array<T>;
    /**
     * The index of the current page.
     */
    page: number;
}
