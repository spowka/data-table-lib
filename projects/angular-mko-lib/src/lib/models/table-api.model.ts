export interface GridApi {
  /**
   * Method to retrieve data based on a provided token.
   * @param {string} token - Token used for data retrieval.
   */
  getData(token: string): void;
}