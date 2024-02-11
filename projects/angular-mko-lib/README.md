# Angular Table Library

[![npm version](https://badge.fury.io/js/angular-mko-lib.svg)](https://www.npmjs.com/package/angular-mko-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

Install the library via npm:

```bash
npm install angular-mko-lib --save
```

## Usage
### Create a Component

1. Import the `DataTableComponent` in your Angular module/component:

```typescript
import { Component } from '@angular/core';
import { DataTableComponent } from 'angular-mko-lib';
import { ColumnPropertiesInterface } from 'angular-mko-lib'; // Column Definition Type 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataTableComponent], // Data Table component
  styleUrls: ['./app.component.css'],
  template: ``
})

export class AppComponent {}
```

### Token & Column Definition

2. To configure the columns of the table, use the `ColumnPropertiesInterface` and bind a token for fetching the data.

```typescript
export class AppComponent {
  public token = DATA_SERVICE_TOKEN; // InjectionToken of your service
  public columns: ColumnPropertiesInterface[] = [
    { display: true, order: 1, header: 'ID', propName: 'id', sorting: true },
    // Add more columns as needed
  ];
}
```
### Rendering the Table
3. Add the `<app-table></app-table>` tag in your template:

```html
<app-table
    [token]="token"
    [columns]="columns">
</app-table>
```
Table will fetch the data with the given URL if `autoLoading` is enabled.

## Configuration


### Events

The library provides the following events:

- `onGridReady`: Triggered when table gets initialized. event with a `GridApi` instance, allowing external components to interact with the table.
- `onClickByRowEvent`: Triggered when a user clicks on a row.
- `onEmptyEvent`: Triggered when the server response is received, but the data is empty.
- `onUpdatedEvent`: Triggered when the server response includes data.
- `onErrorEvent`: Triggered in case of an HTTP error.

Example of an event:

```html
<app-table
    [token]="token"
    [columns]="columns"
    (onGridReady)="onGridReady($event)"
    (onClickByRowEvent)="onClickByRowEvent($event)"
    (onEmptyEvent)="onEmptyEvent($event)"
    (onUpdatedEvent)="onUpdatedEvent($event)"
    (onErrorEvent)="onErrorEvent($event)">
</app-table>
```

```typescript
import {
  ClickByRowEventInterface,
  UpdatedEventInterface,
  EmptyEventInterface,
  ErrorEventInterface
} from 'angular-mko-lib';
// ...

onClickByRowEvent(event: ClickByRowEventInterface): void {
  console.log('Row Clicked:', event);
}

// Lifecycle hook of library which includes API callback
onGridReady(api: GridApi) {
  // Force load the data in case if token provided with input parameter
  api.getData();

  // Force load the data using the provided token (will replace token passed by input parameter if provided)
  api.getData(this.token);
}
```
If you prefer an alternate way to fetch data or force data loading, utilize the `api` callback with the `getData` method. This can be useful when `autoLoading` is not provided.<br>
**Note**: Library provides `api` callback with `getData` method which accepts `token`.<br>
*If token (argument) binding via getData provided then binding token with @Input property will be ignored or replaced.*

### Input Options

- **token** (InjectionToken\<GridInjectionService>): Bind a token for fetching data.
- **autoLoading** (boolean, default: `false`): Enable or disable automatic data loading after table initialization.
- **messageNotFound** (string): The message displayed when no data is found.
- **messagePending** (string): The message displayed while data is being loaded.
- **header** (string): Set the table name (header).

```html
<app-data-table
  [token]="token"
  [columns]="columns"
  [autoLoading]="true"
  [messageNotFound]="'No data found.'"
  [messagePending]="'Loading data...'"
  [header]="'Your Table Header'">
</app-data-table>
```

## URL Navigation

The library supports automatic URL navigation for actions like sorting, navigation, and fetching data. The URL structure follows this pattern:

```
YOUR_WEBSITE_URL/?page=1&limit=25&order%5Bby%5D=created&order%5Btype%5D=desc
```

Refreshing the page with this URL will result in the table rendering based on the specified parameters.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
