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
    this.isEditPending = false;

    if (rowConfig && rowConfig.rowApi) {
      // Execute a function decorator.
      if (typeof rowConfig.rowApi === 'function') {
        rowConfig.rowApi(this);
        angular.extend(Row.prototype, rowConfig.rowApi.prototype);
      } else {
        angular.extend(Row.prototype, rowConfig.rowApi);
      }
    }

    for (var i = 0, length = flattenedColumns.length; i < length; i++) {
      this.cells_.push(new Cell(flattenedColumns[i], this));
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

  /**
   * Saves cells that are in isPendingEdit mode;
   */
  Row.prototype.save = function() {
    for (var i = 0, length = this.cells_.length; i < length; i++) {
      var cell = this.cells_[i];

      if (cell.isEditPending) {
        cell.save();
      }

      this.isEditPending = false;
    }
  };

  return Row;
}]);