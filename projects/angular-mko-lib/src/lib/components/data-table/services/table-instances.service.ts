import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableInstancesService {
  private instanceCount = 0;

   /**
   *  Increments the instance count when a new table is created.
   */
  increment() {
    this.instanceCount++;
  }

  
  /**
   * Decrements the instance count when a table is destroyed.
   */
  decrement() {
    this.instanceCount--;
  }

  /**
   * Returns the current count of table instances.
   * @returns {number} The current instance count.
   */
  getCount() {
    return this.instanceCount;
  }
}
