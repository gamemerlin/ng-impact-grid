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
      <th width="200">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>columns</td>
      <td>Array.&lt;<a href="#col-definition">Column Definition</a>&gt;</td>
      <td>A list of column definition configurations.</td>
    </tr>
    <tr>
      <td>header</td>
      <td><a href="#header-definition">Object</a></td>
      <td>The configuration for the header.</td>
    </tr>
    <tr>
      <td>rows</td>
      <td><a href="#row-definition">Object</a></td>
      <td>The row configurations for this grid.</td>
    </tr>
    <tr>
      <td>table</td>
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
      <th width="100">Config Id</th>
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>css</td>
      <td>Object</td>
      <td>
          <p>A configuration for custom css classes for the column and header as follows:</p>
          ```
          css: {
            header: Array.&lt;(String),
            cell: Array.&lt;(String)
          }
          ```
          <p>css.header - adds the specified list of custom css classes to this header TH</p>
          <p>css.cell - adds the specified list of css classes to both the header TH and body TD</p>
      </td>
    </tr>
    <tr>
      <td>field</td>
      <td>(String|Function)</td>
      <td>
        <p>If string this is a key that maps to the row data.
          If a function is provided it will be executed as a getter on the raw json data to retrieve deep data:</p>
          <pre>
          field: function(data) {
            return data.someProp1.someProp2.someValue;
          }</pre>
      </td>
    </tr>
    <tr>
      <td>isSortable</td>
      <td>Boolean</td>
      <td>Whether this column is sortable.</td>
    </tr>
    <tr>
      <td>title</td>
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
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>isSticky</td>
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
      canEdit: function(Row) {
        return $scope.canIDeleteThis(Row);
      },
      deleteHandler: function(Row) {
        $scope.deleteItemFromController(Row)
      }
    };
```

<table>
  <thead>
    <tr>
      <th width="100">Config Id</th>
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>canEdit</td>
      <td>Function</td>
      <td>
          A application handler to determine whether the user can edit this row. Takes as an argument the <a href="#row-model-api">Row model</a> from the grid.
      </td>
    </tr>
    <tr>
      <td>deleteHandler</td>
      <td>Function</td>
      <td>
          An application delete handler to delete this row. Takes as an argument the <a href="#row-model-api">Row model</a> from the grid.
      </td>
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
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>autoHeightResize</td>
      <td>Boolean</td>
      <td>Will attemp to resize the TBODY to fit the page vertically if true.</td>
    </tr>
    <tr>
      <td>autoHeightResizeWithoutWindowScroll</td>
      <td>Boolean</td>
      <td>Will attemp to resize the TBODY to fit the page vertically and remove overflow-y fro the document BODY (document will have not scrollbars) if true.</td>
    </tr>
    <tr>
      <td>canScrollY</td>
      <td>Boolean</td>
      <td>Enable vertical scrolling of table body for long data sets if true.</td>
    </tr>
    <tr>
      <td>canScrollX</td>
      <td>Boolean</td>
      <td>Enable horizontal scrolling of wide data sets if true.</td>
    </tr>
    <tr>
      <td>bodyHeight</td>
      <td>Number</td>
      <td>A set height for the table</td>
    </tr>
  </tbody>
</table>