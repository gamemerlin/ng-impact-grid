var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridTd', ['$compile', function($compile) {
  return {
    restrict: 'C',
    link: function(scope, element, attrs) {
      // Add custom css class during link. These classes
      // are not dynamic, we are adding at link time to avoid
      // an ng-class binding on each cell.
      if (scope.GridCtrl.cellCssClasses[scope.cell.field]) {
        element.addClass(scope.GridCtrl.cellCssClasses[scope.cell.field].join(' '));
      }

      var defaultCellTemplate = '<span ng-bind="cell.value"></span>',
          cellContent = scope.cell.template || defaultCellTemplate;

      element.append($compile(cellContent)(scope));
    }
  }
}]);