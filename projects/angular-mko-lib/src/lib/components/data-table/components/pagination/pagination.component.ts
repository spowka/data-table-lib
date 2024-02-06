import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PaginationValue } from './models/pagination-value.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
})
export class PaginationComponent implements OnInit {
  @Input() page: number;
  @Input() limit: number;
  @Input() total: number;
  @Input() pageSizes: number[] = [5, 10, 25, 50];

  @Output() change: EventEmitter<PaginationValue> = new EventEmitter();

  public visiblePages: number[];

  public _page: number;
  public _limit: number;

  constructor() { }

  ngOnInit(): void {
    this._page = this.page;
    this._limit = this.limit;
    this.updateVisiblePages();
  }

  /**
   * Sets a specific page and emits a change event with the updated page and limit values.
   * @param {number} page - The page to be selected.
   */
  selectPage(page: number) {
    this._page = page;
    this.change.emit({ page: this._page, limit: this._limit })
    this.updateVisiblePages();
  }

  /**
   * Sets a specific page size and emits a change event with the updated page and limit values.
   * @param {number} limit - The page size to be selected.
   */
  selectPageSize(limit: number) {
    this._limit = limit;
    this.change.emit({ page: this._page, limit: this._limit })
  }

  /**
   * Updates the visible pages based on the currently selected page and total number of pages.
   * Determines the range of visible pages around the selected page, with a maximum of 5 pages.
   * Calculates the starting index for the visible pages to ensure proper pagination display.
   * @private
   */
  private updateVisiblePages(): void {
    // Determine the maximum number of visible pages, capped at 5.
    const length = Math.min(this.total, 5);

    // Calculate the starting index for the visible pages.
    const startIndex = Math.max(
      Math.min(
        this._page - Math.ceil(length / 2),
        this.total - length
      ), 0
    );

    this.visiblePages = Array.from(
      new Array(length).keys(),
      (item) => item + startIndex + 1
    );
  }

}
