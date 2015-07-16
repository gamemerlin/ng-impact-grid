'use strict';

/* Directives */
var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGrid', function () {
  /**
   * Constructor for the directive grid controller.
   * @param $scope
   * @constructor
   */
  function MccGridController($scope, $filter, RowModel) {
    this.scope_ = $scope;
    this.filter_ = $filter;
    this.RowModel_ = RowModel;
    this.rows_ = [];
    this.columnOrdering_ = [];
    this.cellCssClasses = {};

    $scope.$watch('config',
        angular.bind(this, function (oldConfig, newConfig) {
      if (newConfig) {
        this.scanForColumnOrderConfigs_(newConfig);
      }
    }));

    // Set up a watch on whether we have both field orderings and
    // all the row data ready so we can render the grid.
    $scope.$watch(
        function () {
          var canRenderRows = $scope.gridData && $scope.gridData.length &&
              $scope.GridCtrl.columnOrdering_.length && $scope.config;

          if (canRenderRows) {
            return $scope.gridData.length;
          }

          return false;
        },
        angular.bind(this,
            function (oldCanRenderRows, newCanRenderRows) {
              if (newCanRenderRows) {
                this.buildTableRows_(
                    $scope.gridData, this.columnOrdering_, $scope.config.rows);
              }
            }));

    $scope.$on(
        'sortColumn',
        angular.bind(this, function(event, field) {
          this.sortColumnBy_(event, field);
        }));
  }
  MccGridController.$inject = ['$scope', '$filter', 'RowModel'];

  /**
   * Scan the grid configs column definitions to get the correct ordering for
   * how the columns should be rendered. Also store and gather the custom
   * css settings for headers and cells.
   *
   * @param gridConfig - the grid's configuration definition.
   * @returns {Array} An array of keys which represent the field ordering.
   * @private
   */
  MccGridController.prototype.scanForColumnOrderConfigs_ = function (gridConfig) {
    var columnDefinitions = gridConfig.columns;

    for (var i = 0, length = columnDefinitions.length; i < length; i++) {
      var firstRowDefinition = columnDefinitions[i];
      if (firstRowDefinition.field) {
        // Breaking apart grouped columns to get single columns in the right order.
        this.columnOrdering_.push(firstRowDefinition.field);
        // Store custom css settings.
        if (firstRowDefinition.css) {
          var key = firstRowDefinition.field;

          if (typeof firstRowDefinition.field === 'object') {
            key = firstRowDefinition.field.key;
          }
          this.cellCssClasses[key] = firstRowDefinition.css.cell || [];
        }
      } else if (firstRowDefinition.columns && firstRowDefinition.columns.length) {
        var groupedColumnDefs = firstRowDefinition.columns;
        for (var j = 0, gLength = groupedColumnDefs.length; j < gLength; j++) {
          var secondRowDefinition = groupedColumnDefs[j];
          if (secondRowDefinition.field) {
            // Breaking apart grouped columns to get single columns in the right order.
            this.columnOrdering_.push(secondRowDefinition.field);

            // Store custom css settings.
            if (secondRowDefinition.css) {
              var key = secondRowDefinition.field;

              if (typeof secondRowDefinition.field === 'object') {
                key = secondRowDefinition.field.key;
              }
              this.cellCssClasses[key] = secondRowDefinition.css.cell || [];
            }
          }
        }
      }
    }
  };

  /**
   * Getter for this grids scope configuration. To be used by other directives.
   * @returns {*}
   */
  MccGridController.prototype.getConfig = function() {
    return this.scope_.config;
  };

  /**
   * Takes the raw row data and wraps each data into a row model to make
   * this grids bindable list of rows.
   * @param rowData - An array of json grid data, this is the original data to wrap.
   * @param columnOrdering - An array of field keys that represent the column ordering
   *     and possible custom mappings to deep data.
   * @param rowConfig - The configuration options for the row model.
   * @private
   */
  MccGridController.prototype.buildTableRows_ = function (rowData, columnOrdering, rowConfig) {
    // Ensure this is empty before rebuilding the rows.
    this.rows_.length = 0;

    for (var i = 0, length = rowData.length; i < length; i++) {
      this.rows_.push(new this.RowModel_(rowData[i], columnOrdering, rowConfig));
    }
  };

  /**
   * @returns {Array}
   *      The list of rows all available. These rows are Row object
   *      wrappers around the grid data.
   */
  MccGridController.prototype.getAllRows = function () {
    return this.rows_;
  };

  MccGridController.prototype.getRowsForPage = function(pageNumber) {
    var pagination = this.getConfig().pagination;
    console.log('getRowsForPage ', pagination)
    return this.getAllRows().slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage);
  };

  /**
   * @returns {Array}
   *      The list of rows to bind to. These rows are Row object
   *      wrappers around the grid data.
   */
  MccGridController.prototype.getViewPortRows = function () {
    var pagination = this.getConfig().pagination;

    return pagination ?
        this.getRowsForPage(pagination.page) : this.getAllRows();
  };

  /**
   * Sort rows by field.
   * @param event
   * @param field
   * @private
   */
  MccGridController.prototype.sortColumnBy_ = function (event, column) {
    this.rows_ = this.filter_('orderBy')(
        this.rows_,
        function(row) {
          if (typeof column.field === 'object') {
            return column.field.getter(row.data_);
          }
          return row.data_[column.field];
        },
        !column.isSortedAsc);
  };

  /**
   * @returns {boolean} We should show the delete column.
   */
  MccGridController.prototype.shouldShowRowDelete = function () {
    var rowConfig = this.getConfig().rows;

    return Boolean(rowConfig && rowConfig.canEdit &&
        rowConfig.canEdit() && rowConfig.deleteHandler);
  };

  return {
    restrict: 'E',
    scope: {
      config: "=",
      gridData: "="
    },
    templateUrl: '../src/mcc-grid/mcc-grid.html',
    replace: true,
    controller: MccGridController,
    controllerAs: 'GridCtrl'
  }
});
