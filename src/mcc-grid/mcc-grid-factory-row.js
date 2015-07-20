var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.factory('RowModel', ['CellModel', function (Cell) {
  /**
   * Wraps the raw data of a row in a row object model for binding
   * purposes and also to preserve state outside of
   * the rendered DOM.
   *
   * @param rowData - The raw data for the row.
   * @param flattenedColumns - An array of flattened columns
   *     in the order that they need to be rendered. Does
   *     not have grouped columns.
   * @param rowConfig - The configuration for this row.
   * @constructor
   */
  function Row(rowData, flattenedColumns, rowConfig) {
    this.data_ = rowData;
    this.cells_ = [];

    for (var i = 0, length = flattenedColumns.length; i < length; i++) {
      var field = flattenedColumns[i].field;

      if (typeof field === 'string') {
        this.cells_.push(
            new Cell(field, flattenedColumns[i], rowData[field]));
      } else if (typeof field === 'object') {
        this.cells_.push(
            new Cell(field.key, flattenedColumns[i], field.getter(rowData)));
      }
    }

    // Passing canEdit from the application to the model.
    if (rowConfig && rowConfig.canEdit) {
      this.canEdit = rowConfig.canEdit;
    }

    // Passing delete handler from the application to the model.
    if (rowConfig && rowConfig.deleteHandler) {
      this.deleteSelf = rowConfig.deleteHandler;
    }
  }

  /**
   * Gets the rows cell object models.
   * @returns {Array}
   */
  Row.prototype.getCells = function () {
    return this.cells_;
  };

  /**
   * Gets the the orginal dataset this model is wrapping.
   * @returns {Object}
   */
  Row.prototype.getData = function () {
    return this.data_;
  };

  return Row;
}]);