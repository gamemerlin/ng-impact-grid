var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridTh', function() {
  function MccThController($scope) {
    this.scope_ = $scope;
  }

  /**
   * @param column - Column config model
   * @private
   */
  MccThController.prototype.sortBy_ = function (column) {
    column.isSortedAsc = !column.isSortedAsc;

    // Fire an event to the grid controller to execute.
    this.scope_.$emit('sortColumn', column);
  };

  /**
   * Set the row and colspans for the element. These attribtues
   * should not be dynamic and should not change during the
   * life-time of the grid, so set them on link and remove
   * from directive bindings.
   * @param element
   * @param column
   * @private
   */
  MccThController.prototype.setRowAndColSpans_ = function (element, column) {
    if (column.rowSpan) {
      element.attr('rowspan', column.rowSpan);
    }

    if (column.colSpan) {
      element.attr('colspan', column.colSpan);
      console.log('should set colspan for  ', column)
    }
  };

  return {
    // Unfortunately there is a bug in the current version of angular that
    // prevents this TH element from being and E type directive that
    // can use replace: true.
    restrict: 'C',
    controller: MccThController,
    controllerAs: 'ThCtrl',
    link: function(scope, element, attrs) {
      // Set row and colspan
      scope.ThCtrl.setRowAndColSpans_(element, scope.column);

      var cssConfigs = scope.column.css;

      if (cssConfigs) {
        if (cssConfigs.header && cssConfigs.header.length) {
          element.addClass(cssConfigs.header.join(' '));
        }

        if (cssConfigs.cell && cssConfigs.cell.length) {
          element.addClass(cssConfigs.cell.join(' '));
        }
      }

      // Hook up column sorting if available.
      if (scope.column && scope.column.isSortable) {
        element.bind('click', function() {
          scope.ThCtrl.sortBy_(scope.column);
          scope.$apply();
        });
      }
    }
  }
});