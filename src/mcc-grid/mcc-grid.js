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
    this.flattenedColumns_ = [];
    this.cellCssClasses = {};

    $scope.$watch('config',
        angular.bind(this, function (oldConfig, newConfig) {
      if (newConfig) {
        this.setFlattendedColumns_(newConfig);
      }
    }));

    // Set up a watch on whether we have both field orderings and
    // all the row data ready so we can render the grid.
    $scope.$watch(
        function () {
          var canRenderRows = $scope.gridData && $scope.gridData.length &&
              $scope.GridCtrl.flattenedColumns_.length && $scope.config;

          if (canRenderRows) {
            return $scope.gridData.length;
          }

          return false;
        },
        angular.bind(this,
            function (oldCanRenderRows, newCanRenderRows) {
              if (newCanRenderRows) {
                this.buildTableRows_(
                    $scope.gridData, this.flattenedColumns_, $scope.config.rows);
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
   * @param column
   * @private
   */
  MccGridController.prototype.addFlattenedColumn_ = function(column) {
    // Breaking apart grouped columns to get single columns in the right order.
    this.flattenedColumns_.push(column);
    // Store custom css settings.
    if (column.css) {
      var key = column.field;

      // A field can be of the form {key: String, getter: Function}
      if (typeof column.field === 'object') {
        key = column.field.key;
      }
      this.cellCssClasses[key] = column.css.cell || [];
    }
  };

  /**
   * Scan the grid configs column definitions to get a flattened ordering
   * for how the columns should be rendered. Also store and gather
   * the custom css settings for headers and cells.
   *
   * @param gridConfig - the grid's configuration definition.
   * @returns {Array} An array of keys which represent the field ordering.
   * @private
   */
  MccGridController.prototype.setFlattendedColumns_ = function (gridConfig) {
    var columnDefinitions = gridConfig.columns;

    for (var i = 0, length = columnDefinitions.length; i < length; i++) {
      var rowOneColumnDef = columnDefinitions[i];
      if (rowOneColumnDef.field) {
        this.addFlattenedColumn_(rowOneColumnDef);
      } else if (rowOneColumnDef.columns && rowOneColumnDef.columns.length) {
        // If we have a grouped column drill in an get the actual column.
        var groupedColumnDefs = rowOneColumnDef.columns;
        for (var j = 0, gLength = groupedColumnDefs.length; j < gLength; j++) {
          var rowTwoColumnDef = groupedColumnDefs[j];
          if (rowTwoColumnDef.field) {
            this.addFlattenedColumn_(rowTwoColumnDef);
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
      var row = new this.RowModel_(rowData[i], columnOrdering, rowConfig);
      this.rows_.push(row);
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
    var paginationState = this.getConfig().pagination;

    return this.getAllRows().slice(
        (paginationState.page - 1) * paginationState.perPage,
        paginationState.page * paginationState.perPage);
  };

  /**
   * Saves all rows and cells in isPendingEdit mode.
   * Note this is an N^2 operation, row.save
   * will iterate through cells.
   */
  MccGridController.prototype.save = function() {
    for (var i = 0, length = this.rows_.length; i < length; i++) {
      var row = this.rows_[i];
      row.save();
      row.isEditPending = false;
    }
  };

  /**
   * @returns {Array}
   *      The list of rows to bind to. These rows are Row object
   *      wrappers around the grid data.
   */
  MccGridController.prototype.getViewPortRows = function () {
    var paginationState = this.getConfig().pagination;

    return paginationState && !paginationState.getPage ?
        this.getRowsForPage(paginationState.page) : this.getAllRows();
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
    templateUrl: 'templates/mcc-grid/mcc-grid.html',
    replace: true,
    controller: MccGridController,
    controllerAs: 'GridCtrl'
  }
});
