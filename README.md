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
  public token = "..."; // Path to your API url
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

onGridReady(api: GridApi) {
  api.getData(this.token);
}
```
If you prefer an alternate way to fetch data or force data loading, utilize the `api` callback with the `getData` method. This can be useful when `autoLoading` is not provided.<br>
**Note**: Library provides `api` callback with `getData` method which accepts `token`.<br>
*If token Input paramter provided then token bindig via getData will be ignored.*

### Input Options

- **token** (string): Bind a token (url) for fetching data.
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
YOUR_WEBSITE_URL/?_page=1&_per_page=10&_sort=id
```
**Note:** use `id` for asc and `-id` for desc.

Refreshing the page with this URL will result in the table rendering based on the specified parameters.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
