export interface ColumnPropertiesInterface {
    /**
     * Show or hide column
     */
    display: boolean;

    /**
     * Cell order in a row
     */
    order: number;

    /**
     * Column name in the table header
     */
    header?: string;

    /**
     * Property name in JSON of the server response
     */
    propName?: string;

    /**
     * Enable / disable column sorting
     */
    sorting?: boolean;

    /**
     * Reference to a component for rendering data into cells
     */
    component?: any;

    /**
     * NICE TO HAVE: Pipe token for fast data transformation.
     * Applicable if the "component" property is undefined.
     * If the "component" property is defined, all transformations
     * occur within the component.
     */
    pipes?: Array<any>;
}