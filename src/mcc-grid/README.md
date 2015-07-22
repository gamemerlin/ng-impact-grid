## Mcc Grid example usage

To use render and mcc grid component, set up a grid configuration and pass in a list of data items:

```
    <mcc-grid
        data-config="gridConfig"
        data-grid-data="gridData"></mcc-grid>
```

It is assumed that your data is a list of JSON objects. The following section explains the grid configuration options.

## Mcc Grid Configuration API

####Mcc Grid Top Level properties

To configure your grid, in your applications controller define a bindable grid configuration object on scope or controller as follows:

```
    $scope.AppCtrl.gridConfig = {
      columns: [..],
      headers: {...},
      rows: {...},
      table: {...}
    }
```

<style type="text/css">
  td {
    vertical-align: top;
  }
</style>

<table>
  <thead>
    <tr>
      <th width="100">Config Id</th>
      <th>Required?</th>
      <th width="200">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>columns</td>
      <td>Yes</td>
      <td>Array.&lt;<a href="#col-definition">Column Definition</a>&gt;</td>
      <td>A list of column definition configurations.</td>
    </tr>
    <tr>
      <td>header</td>
      <td>No</td>
      <td><a href="#header-definition">Object</a></td>
      <td>The configuration for the header.</td>
    </tr>
    <tr>
      <td>row</td>
      <td>No</td>
      <td><a href="#row-definition">Object</a></td>
      <td>The row configurations for this grid.</td>
    </tr>
    <tr>
      <td>pagination</td>
      <td>No</td>
      <td><a href="#pagination-definition">Object</td>
      <td>Options for grid pagination.</td>
    </tr>
    <tr>
      <td>table</td>
      <td>No</td>
      <td><a href="#table-definition">Object</td>
      <td>Options for the grid behavior.</td>
    </tr>
  </tbody>
</table>

####Mcc Grid Column definition <a name="col-definition"></a>
Example usage:
```
      $scope.AppCtrl.gridConfig.columns[
        {
          css: {
            header: ['header-0'],
            cell: ['col-0']
          },
          field: 'name',
          isSortable: true,
          title: 'Name'
        }
      ];
```

<table>
  <thead>
    <tr>
      <th width="70">Config Id</th>
      <th>Required?</th>
      <th width="250">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>css</td>
      <td>No</td>
      <td>Object</td>
      <td>
          <p>A configuration for custom css classes for the column and header as follows:</p>
          <pre>
          css: {
            header: Array.&lt;(String),
            cell: Array.&lt;(String)
          }
          </pre>
          <p>css.header - adds the specified list of custom css classes to this header TH</p>
          <p>css.cell - adds the specified list of css classes to both the header TH and body TD</p>
      </td>
    </tr>
    <tr>
      <td>field</td>
      <td>No</td>
      <td>(String|{key: String, getter: Function, setter: Function})</td>
      <td>
        <p>If string is provided, this is a key that maps to the row data field.
          If a object is provided its getter will be executed on the raw json data to retrieve deep data. Its setter will be called to set data if rows are editable:</p>
          <pre>
          field: {
            key: 'SomeStringForInternalColumnReference',
            getter(data) {
              return data.someProp1.someProp2.someValue;
            },
            setter(data, value) {
              data.some.deep.prop = value;
            }
          </pre>
      </td>
    </tr>
    <tr>
      <td>isSortable</td>
      <td>No</td>
      <td>Boolean</td>
      <td>Whether this column is sortable.</td>
    </tr>
    <tr>
      <td>title</td>
      <td>No</td>
      <td>String</td>
      <td>The display title of this column.</td>
    </tr>
  </tbody>
</table>

####Mcc Grid header configuration options <a name="header-definition"></a>
Example usage:
```
    $scope.AppCtrl.gridConfig.header: {
        isSticky: false
    };
```

<table>
  <thead>
    <tr>
      <th width="100">Config Id</th>
      <th>Required?</th>
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>isSticky</td>
      <td>No</td>
      <td>Boolean</td>
      <td>
          Whether sticky headers should be enabled. If true the header will be fixed at position:0 if the user scrolls past the table.
      </td>
    </tr>
  </tbody>
</table>

####Mcc Grid row configuration options <a name="row-definition"></a>
Example usage:
```
    $scope.AppCtrl.gridConfig.rows: {
     extension: {
             deleteInProgress: false,
             canEdit: function(row) {
               return $scope.canIDeleteThis(row);
             },
             deleteRow: function(row) {
               row.deleteInProgress = true;
               $scope.deleteItemFromController(row)
             }
           }
    };
```

<table>
  <thead>
    <tr>
      <th width="100">Config Id</th>
      <th>Required?</th>
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>extension</td>
      <td>No</td>
      <td>Object</td>
      <td>
          A hook to extend the row view model. You can edit properties and functions here. A use case would be to extend functionality for delete,
          in which case you may need to add flags for canIEdit, isDeletePending and the actually hook to your app to delete. Assumes you will pass
          a custom template to a cell to take advantage of your extension.
      </td>
    </tr>
  </tbody>
</table>

####Mcc Grid pagination configuration options <a name="pagination-definition"></a>
Example usage local pagination:
```
    $scope.AppCtrl.gridConfig.pagination {
      perPageSizes: [5, 10, 25, 50, 100]
    }
```

Example usage local pagination:
```
    $scope.AppCtrl.gridConfig.pagination {
      perPageSizes: [5, 10, 25, 50, 100],
      totalCount: $scope.externalCountFromResource,
      getPage: function(paginationState) {
        // should use pagination state to make a remote resource call
        // and reset the grid's data rows.
      }
    }
```

<table>
  <thead>
    <tr>
      <th width="100">Config Id</th>
      <th>Required?</th>
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>perPageSizes</td>
      <td>Yes</td>
      <td>Array.&lt;Number&gt;</td>
      <td>An array of per page sizes</td>
    </tr>
    <tr>
      <td>totalCount</td>
      <td>No</td>
      <td>Number</td>
      <td>If this is a remote paginator, totalCount must be provided.</td>
    </tr>
    <tr>
      <td>getPage</td>
      <td>No</td>
      <td>Function</td>
      <td>A get page handler for remote pagingation. Takes the pagination state as an argument and is meant to reset the rows of this grid on each call.</td>
    </tr>
  </tbody>
</table>

####Mcc Grid table configuration options <a name="table-definition"></a>
Example usage:
```
    $scope.AppCtrl.gridConfig.table = {
      autoHeightResize: false,
      autoHeightResizeWithoutWindowScroll: true,
      canScrollX: false,
      canScrollY: true,
      bodyHeight: 100
    }
```

<table>
  <thead>
    <tr>
      <th width="100">Config Id</th>
      <th>Required?</th>
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>autoHeightResize</td>
      <td>No</td>
      <td>Boolean</td>
      <td>Will attemp to resize the TBODY to fit the page vertically if true.</td>
    </tr>
    <tr>
      <td>autoHeightResizeWithoutWindowScroll</td>
      <td>No</td>
      <td>Boolean</td>
      <td>Will attemp to resize the TBODY to fit the page vertically and remove overflow-y fro the document BODY (document will have not scrollbars) if true.</td>
    </tr>
    <tr>
      <td>canScrollY</td>
      <td>No</td>
      <td>Boolean</td>
      <td>Enable vertical scrolling of table body for long data sets if true.</td>
    </tr>
    <tr>
      <td>canScrollX</td>
      <td>No</td>
      <td>Boolean</td>
      <td>Enable horizontal scrolling of wide data sets if true.</td>
    </tr>
    <tr>
      <td>bodyHeight</td>
      <td>No</td>
      <td>Number</td>
      <td>A set height for the table</td>
    </tr>
  </tbody>
</table>
