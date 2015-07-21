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

    this.value = columnDef.field.getter ?
        columnDef.field.getter(row.getData()) : row.getData()[this.field];

    if (columnDef.field.setter) {
      this.setValue = columnDef.field.setter;
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
