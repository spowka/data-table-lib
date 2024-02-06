export interface GridRequestInterface {
    /**
     * Page number
     */
    page: number;

    /**
     * Sample size
     */
    limit: number;

    /**
     * Sorting data
     */
    order?: {
        by: string; // The name of the property by which we sort the data. One of those that we receive in the response from the server.
        type: 'desc' | 'asc';
    };
}