var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.factory('CellModel', function(){
  /**
   * Wraps a row's rendered field in a cell model for
   * binding purposes and to preserve state outside of
   * the visible DOM.
   *
   * @param field
   * @param value
   * @constructor
   */
  function Cell(field, value) {
    this.field = field;
    this.value = value;
  }

  return Cell;
});
