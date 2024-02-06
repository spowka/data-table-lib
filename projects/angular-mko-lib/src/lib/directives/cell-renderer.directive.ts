import {
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  Type,
  ViewContainerRef
} from '@angular/core';

import { CellRendererComponent, GridRequestInterface } from '../models';

@Directive({
  selector: '[cellRendererComponent]',
  standalone: true,
})
export class CellRendererDirective implements OnInit, OnChanges {
  @Input({ required: true }) componentType: Type<any>;
  @Input() cellData: any;
  @Input() filters: GridRequestInterface;

  private componentRef?: ComponentRef<CellRendererComponent>;

  constructor(private container: ViewContainerRef) { }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["componentType"]) {
      this.loadComponent();
    }
    if (changes["cellData"]) {
      this.updateCellValue();
    }
  }

  /**
   * Loads the associated component based on the provided 'componentType'.
   * @private
   */
  private loadComponent() {
    if (!this.componentType) return;

    // Destroys all views in this container.
    this.container.clear();
    this.componentRef = this.container.createComponent(this.componentType);
    this.updateCellValue();
  }

  /**
   * Updates the cell value for the currently loaded component.
   * Calls the 'cellInit' callback method on the component instance with the current 'cellData' and 'filters'.
   * @private
   */
  private updateCellValue() {
    if (this.componentRef) {
      this.componentRef.instance.cellInit({ data: this.cellData, filters: this.filters });
    }
  }
}
