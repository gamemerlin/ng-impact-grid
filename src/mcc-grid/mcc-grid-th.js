var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridTh', ['$compile', function($compile) {
  function MccThController($scope) {
    this.scope_ = $scope;
  }

  /**
   * @param column - Column config model
   * @private
   */
  MccThController.prototype.sortBy_ = function (thCol) {
    thCol.isSortedAsc = !thCol.isSortedAsc;

    // Fire an event to the grid controller to execute.
    this.scope_.$emit('sortColumn', thCol);
  };

  /**
   * Set the row and colspans for the element. These attribtues
   * should not be dynamic and should not change during the
   * life-time of the grid, so set them on link and remove
   * from directive bindings.
   * @param element
   * @param thCol - this is a column def from the gridConfig's column array.
   * @private
   */
  MccThController.prototype.setRowAndColSpans_ = function (element, thCol) {
    if (thCol.rowSpan) {
      element.attr('rowspan', thCol.rowSpan);
    }

    if (thCol.colSpan) {
      element.attr('colspan', thCol.colSpan);
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
      scope.ThCtrl.setRowAndColSpans_(element, scope.thCol);

      var cssConfigs = scope.thCol.css;

      if (cssConfigs) {
        if (cssConfigs.header && cssConfigs.header.length) {
          element.addClass(cssConfigs.header.join(' '));
        }

        if (cssConfigs.cell && cssConfigs.cell.length) {
          element.addClass(cssConfigs.cell.join(' '));
        }
      }

      // Hook up column sorting if available.
      if (scope.thCol && scope.thCol.isSortable) {
        element.bind('click', function() {
          scope.ThCtrl.sortBy_(scope.thCol);
          scope.$apply();
        });
      }

      var defaultThTemplate = '<span ng-bind="thCol.title"></span>',
          thContent = scope.thCol.thTemplate || defaultThTemplate;

      element.empty().append($compile(thContent)(scope));
    }
  }
}]);