var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.factory('CellModel', function(){
  /**
   * Wraps a row's rendered field in a cell model for
   * binding purposes and to preserve state outside of
   * the visible DOM.
   *
   * @param columnDef - column configuration
   * @param row - Parent row
   * @constructor
   */
  function Cell(columnDef, row) {
    this.field = columnDef.key || columnDef.field;
    this.isEditPending = false;
    this.row_ = row;
    this.template = columnDef.template;

    if (!columnDef.field) {
      throw new Error('Cell cannot be rendered because ' +
          'it does not have a \'field\' defined.')
    }

    this.value = columnDef.field.getter ?
        columnDef.field.getter(row.getData()) : row.getData()[this.field];

    if (columnDef.field.setter) {
      this.setValue = columnDef.field.setter;
    }

    if (columnDef && columnDef.cellApi) {
      // Execute a function decorator.
      if (typeof columnDef.cellApi === 'function') {
        columnDef.cellApi(this);
        angular.extend(Cell.prototype, columnDef.cellApi.prototype);
      } else {
        angular.extend(Cell.prototype, columnDef.cellApi);
      }
    }
  }

  /**
   * Saves the current cell.value into the original
   * row.data_.
   */
  Cell.prototype.save = function() {
    if (this.setValue) {
      this.setValue(this.row_.getData(), this.value);
    } else {
      this.row_.getData()[this.field] = this.value;
    }

    this.isEditPending = false;
  };

  /**
   * @returns {Object} The parent row.
   */
  Cell.prototype.getRow = function() {
    return this.row_;
  };

  return Cell;
});
