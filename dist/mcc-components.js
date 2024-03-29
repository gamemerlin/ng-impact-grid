(function() {
"use strict";

// An empty module for directives.
angular.module('mcc.components', [
  'mcc.directives.grid',
  'mcc.factory.dialog'
]);

// grid module
angular.module('mcc.directives.grid', ['mcc.directives.templates']);

// dialog module
angular.module("mcc.factory.dialog", []);
var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridBody', function() {
  /**
   * @param $scope
   * @constructor
   */
  function MccGridBodyController($scope, $element, $window, $document, $timeout, domUtils) {
    this.scope_ = $scope;
    this.element_ = $element;
    this.window_ = $window;
    this.document_ = $document;
    this.timeout_ = $timeout;
    this.domUtils_ = domUtils;

    $scope.$watch('BodyCtrl.getAutoResize()', angular.bind(
        this,
        function (oldAutoResize, newAutoResize) {
          if (newAutoResize) {
            if (this.getTableConfig().autoHeightResizeWithoutWindowScroll) {
              this.bindWindowResizeForAutoHeight_(true);
            } else if (this.getTableConfig().autoHeightResize) {
              this.bindWindowResizeForAutoHeight_();
            }
          }
        }));
  }
  MccGridBodyController.$inject = ['$scope', '$element', '$window', '$document', '$timeout', 'domUtils'];

  /**
   * @returns {Object} Table section of the grid config.
   */
  MccGridBodyController.prototype.getTableConfig = function() {
    return this.scope_.GridCtrl.getConfig().table;
  };

  /**
   * @returns {boolean} Whether this grid body can scroll on the X axis.
   */
  MccGridBodyController.prototype.canScrollX = function() {
    return this.getTableConfig() && this.getTableConfig().canScrollX;
  };

  /**
   * @returns {boolean} Whether this grid body can scroll on the Y axis.
   */
  MccGridBodyController.prototype.canScrollY = function() {
    return this.getTableConfig() && this.getTableConfig().canScrollY;
  };

  MccGridBodyController.prototype.getHeight = function() {
    return this.getTableConfig() && this.getTableConfig().bodyHeight;
  };

  MccGridBodyController.prototype.getAutoResize = function() {
    return this.getTableConfig() && (this.getTableConfig().autoHeightResize ||
        this.getTableConfig().autoHeightResizeWithoutWindowScroll);
  };

  /**
   * @param isBodyScrollOff - Whether we should forcibly remove
   *     scrolling from the BODY.
   * @private
   */
  MccGridBodyController.prototype.bindWindowResizeForAutoHeight_ =
      function(isBodyScrollOff) {
        // Remove the vertical scrollbar from this window
        if (isBodyScrollOff) {
          angular.element(this.document_).find('body').css('overflow-y', 'hidden');
        }

        var tableBodyContainer = angular.element(this.element_);

        angular.element(this.window_).bind('resize', angular.bind(
          this,
          function() {
            var windowScrollTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;

            var positionRelativeToWindow = this.domUtils_.getOffsetFor(tableBodyContainer) - windowScrollTop,
                newBodyHeight = this.window_.innerHeight - positionRelativeToWindow;

            tableBodyContainer.css('height', newBodyHeight + 'px');
          }));

        // Some edge cases load this table via ajax and makes
        // the initial firing of resize unpredicable. Wrap in a timeout
        // to guarantee this will resize after all other dom events.
        this.timeout_(angular.bind(this, function() {
          angular.element(this.window_).triggerHandler('resize');
        }));
  };

  return {
    restrict: 'A',
    replace: true,
    controller: MccGridBodyController,
    controllerAs: 'BodyCtrl',
    templateUrl: 'templates/mcc-grid/mcc-grid-body.html'
  }
});

var myModule = angular.module('mcc.directives.grid');

myModule.factory('domUtils', ['$window', function($window) {
  var domUtil = {
    /**
     * Gets the scrollTop of the page.
     *
     * @returns {*}
     */
    scrollTop: function() {
      return window.pageYOffset ?
          window.pageYOffset : document.body.scrollTop;
    },
    /**
     * @param element
     * @returns The offset of the element relative to document.
     */
    getOffsetFor: function(element) {
      var elementTopPosition = (element.getBoundingClientRect && element.getBoundingClientRect().top) ||
          (element[0] && element[0].getBoundingClientRect && element[0].getBoundingClientRect().top);
      return this.scrollTop() + elementTopPosition;
    }
  };
  // factory function body that constructs shinyNewServiceInstance
  return domUtil;
}]);
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
var mccGridModule = angular.module('mcc.directives.grid');

function MccGridHeaderController($scope, $element, $window, domUtils) {
  this.scope_ = $scope;
  this.element_ = $element;
  this.window_ = $window;
  this.domUtils_ = domUtils;

  this.firstHeaderRow = [];
  this.secondHeaderRow = [];
  this.hasGroupedColumns = false;

  $scope.$watch(
      'GridCtrl.getConfig().columns',
      angular.bind(this, function (oldDefs, newDefs) {
        if (newDefs && newDefs.length) {
          this.buildHeader_(newDefs);
        }}));


  /**
   * TODO: Inject sticky header service
   * If isSticky window.onscroll service handler.
   */
  $scope.$watch(
      'GridCtrl.getConfig().header.isSticky',
      angular.bind(this, function (oldIsSticky, newIsSticky) {
        if (newIsSticky) {
          this.bindWindowScrollForStickyHeaders_(this.element_)
        }}));
}
MccGridHeaderController.$inject = ['$scope', '$element', '$window', 'domUtils'];

/**
 * Builds the column header out. Inspects the columnDefs to check
 * if we have column groups that need to be separated out between
 * the first or second rows.
 *
 * @param newDefs
 * @private
 */
MccGridHeaderController.prototype.buildHeader_ = function (columnDefs) {
  this.hasGroupedColumns = this.scanForGroupedColumns_(columnDefs);
  if (this.hasGroupedColumns) {
    this.setFirstTrRowSpans_(this.firstHeaderRow);
  }
};

/**
 * * Does a pass on all the column defs to see if we have grouped columns.
 * If we do then we call a method to set the correct rowspans.
 * @param columnDefs
 * @returns {boolean} Whether this header has grouped columns
 * @private
 */
MccGridHeaderController.prototype.scanForGroupedColumns_ = function (columnDefs) {
  var columnIndex = 0;

  for (var i = 0, length = columnDefs.length; i < length; i++) {
    var columnDef = columnDefs[i],
        isColumnGroup = columnDef.columns && columnDef.columns.length;

    if (!isColumnGroup) {
      // Set column index for first cell
      columnDefs[i].columnIndex = columnIndex;
      columnIndex++;
    }

    // Push this column header into the first row.
    this.firstHeaderRow.push(columnDefs[i]);

    if (isColumnGroup) {
      columnDef.colSpan = columnDef.columns.length;
      for (var j = 0, gLength = columnDef.columns.length; j < gLength; j++) {
        // Set column index
        columnDef.columns[j].columnIndex = columnIndex;
        columnIndex++;

        this.secondHeaderRow.push(columnDef.columns[j]);
      }
    }
  }

  return this.secondHeaderRow.length;
};

/**
 * Sets row spans for the first row fo the table headers.
 * @param firstHeaderRows - First row of cells for table header.
 * @private
 */
MccGridHeaderController.prototype.setFirstTrRowSpans_ = function (firstHeaderRows) {
  var HEADER_ROW_SPAN = 2;

  for (var i = 0, length = firstHeaderRows.length; i < length; i++) {
    if (!firstHeaderRows[i].columns) {
      firstHeaderRows[i].rowSpan = HEADER_ROW_SPAN;
    }
  }
};

/**
 * @returns {boolean} Whether the header is sticky.
 */
MccGridHeaderController.prototype.isSticky = function() {
  return this.scope_.GridCtrl.getConfig().header.isSticky;
};

/**
 * @private
 */
MccGridHeaderController.prototype.bindWindowScrollForStickyHeaders_ = function () {
  angular.element(this.window_).bind('scroll',
      angular.bind(this, this.handleWindowScrollForStickyHeaders_));
};

MccGridHeaderController.prototype.handleWindowScrollForStickyHeaders_ = function () {
  var header = angular.element(this.element_),
      tableBody,
      gridContainer = header.parent(),
      headerScrollTop = this.element_[0].getBoundingClientRect().top;

  var isWindowPastHeader = this.domUtils_.scrollTop() > headerScrollTop;

  if (!tableBody) {
    tableBody = header.next().find('table');
  }

  var tableBodyRows = tableBody.find('tr'),
      lastRow = tableBodyRows[tableBodyRows.length - 1],
      lastRowOffsetTop = this.domUtils_.getOffsetFor(lastRow);

  if (isWindowPastHeader) {
    gridContainer.css('padding-top', header[0].offsetHeight + 'px');
    header.css({
      'position': 'fixed',
      'top': 0,
      'width': tableBody[0].offsetWidth
    });

    if (this.domUtils_.scrollTop() > lastRowOffsetTop - header[0].offsetHeight) {
      header.css('display', 'none');
    } else {
      header.css('display', '');
    }
  } else {
    header.css({
      'display': '',
      'position': '',
      'top': '',
      'width': ''
    });
    header.css('width', '');
    gridContainer.css('padding-top', '');
  }
};

mccGridModule.directive('mccGridHeader', function () {
  return {
    restrict: 'C',
    templateUrl: 'templates/mcc-grid/mcc-grid-header.html',
    controller: MccGridHeaderController,
    controllerAs: 'HeaderCtrl'
  }
});
var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridFooter', function() {
  /**
   * @param $scope
   * @constructor
   */
  function MccGridPaginationController($scope) {
    this.scope_ = $scope;

    var deregisterStateWatch = this.scope_.$watch(
        'PaginationCtrl.getState()',
        angular.bind(this, function() {
          this.updatePagingationState_();
          deregisterStateWatch();
        }));

    // Todo clean this up.
    function isNormalInteger(str) {
      return /^\+?(0|[1-9]\d*)$/.test(str);
    }

    this.scope_.$watch(
      'PaginationCtrl.getState().page',
      angular.bind(this, function(newVal, oldVal) {
        if (!isNormalInteger(newVal)) {
          $scope.PaginationCtrl.getState().page =
              isNormalInteger(oldVal) ? oldVal : 1;
        }

        $scope.PaginationCtrl.getState().page =
            Math.min($scope.PaginationCtrl.getState().page, this.getTotalPages());
        $scope.PaginationCtrl.getState().page =
            Math.max($scope.PaginationCtrl.getState().page, 1);
    }));
  }
  MccGridPaginationController.$inject = ['$scope'];

  /**
   * @returns {$scope.gridConfig.pagination} the pagination
   * configuration settings for the global grid config.
   */
  MccGridPaginationController.prototype.getState = function() {
    return this.scope_.GridCtrl.getConfig().pagination;
  };

  MccGridPaginationController.prototype.getTotalCount = function() {
    // Remote Pagination.
    if (this.getState().getPage) {
      return this.getState().totalCount;
    }

    return this.getState().totalCount = this.scope_.GridCtrl.getAllRows().length;
  };

  MccGridPaginationController.prototype.getPerPage = function() {
    var config = this.getState();
    var DEFAULT_PER_PAGE = 10;

    // Take the per page if it is passed in. Else take the
    // first per page size if supplied. Default to 10 if
    // nothing is provided.
    config.perPage = config.perPage ? config.perPage :
        config.perPageSizes && config.perPageSizes.length ? config.perPageSizes[0] : DEFAULT_PER_PAGE;

    return config.perPage;
  };

  MccGridPaginationController.prototype.getPerPageSizes = function() {
    return this.getState().perPageSizes;
  };

  MccGridPaginationController.prototype.setPageSize = function(pageLength) {
    this.getState().perPage = pageLength;
    this.getState().totalPages =
        Math.ceil(this.getTotalCount() / this.getState().perPage);

    // Send user back to page 1
    this.getState().page = 1;

    this.gotoPage(this.getState().page);
  };

  MccGridPaginationController.prototype.getTotalPages = function() {
    var config = this.getState();
    config.totalPages = Math.ceil(this.getTotalCount() / this.getPerPage());

    return this.getState().totalPages;
  };

  MccGridPaginationController.prototype.gotoPage = function(targetPage) {
    this.updatePagingationState_(targetPage);

    if (this.getState().getPage) {
      this.getState().getPage(this.getState());
    }

  };

  MccGridPaginationController.prototype.updatePagingationState_ = function(targetPage) {
    var config = this.getState();

    config.page = targetPage || config.page || 1;

    config.firstPage = 1;
    config.lastPage = this.getTotalPages();

    var newPrev = config.page - 1,
        newNext = config.page + 1;

    config.prevPage = Math.max(newPrev, 1);
    config.nextPage = Math.min(newNext, config.totalPages);
  };

  MccGridPaginationController.prototype.isPageSelected = function(pageLength) {
    return this.getState().perPage === pageLength;
  };

  MccGridPaginationController.prototype.gotoFirstPage = function() {
    this.gotoPage(this.getState().firstPage);
  };

  MccGridPaginationController.prototype.gotoLastPage = function() {
    this.gotoPage(this.getState().lastPage);
  };

  MccGridPaginationController.prototype.gotoPrevPage = function() {
    this.gotoPage(this.getState().prevPage);
  };

  MccGridPaginationController.prototype.gotoNextPage = function() {
    this.gotoPage(this.getState().nextPage);
  };

  MccGridPaginationController.prototype.isFirstPageEnabled = function() {
    return this.getState().page !== this.getState().firstPage;
  };

  MccGridPaginationController.prototype.isPrevPageEnabled = function() {
    return this.getState().page !== this.getState().prevPage;
  };

  MccGridPaginationController.prototype.isNextPageEnabled = function() {
    return this.getState().page !== this.getState().nextPage;
  };

  MccGridPaginationController.prototype.isLastPageEnabled = function() {
    return this.getState().page !== this.getState().lastPage;
  };

  return {
    restrict: 'A',
    replace: true,
    controller: MccGridPaginationController,
    controllerAs: 'PaginationCtrl',
    templateUrl: 'templates/mcc-grid/mcc-grid-pagination.html'
  }
});

var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridTd', ['$compile', function($compile) {
  return {
    restrict: 'C',
    link: function(scope, element, attrs) {
      // Add custom css class during link. These classes
      // are not dynamic, we are adding at link time to avoid
      // an ng-class binding on each cell.
      var cellCssClasses =
          scope.GridCtrl.cellCssClasses[scope.cell.field.key || scope.cell.field];

      if (cellCssClasses && cellCssClasses.length) {
        element.addClass(cellCssClasses.join(' '));
      }

      var defaultCellTemplate = '<span ng-bind="cell.value"></span>',
          cellContent = scope.cell.template || defaultCellTemplate;

      element.append($compile(cellContent)(scope));
    }
  }
}]);
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
'use strict';

/* Directives */
var mccGridModule = angular.module('mcc.directives.grid');

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
      angular.bind(this, function (newConfig) {
        if (newConfig) {
          this.setFlattendedColumns_(newConfig);
        }
      }));

  // Sets up a $watch to determine when to redraw the grid rows.
  // Set watch on gridData.length.
  $scope.$watch(
      function () {
        var canRenderRows = $scope.gridData && $scope.gridData.length &&
            $scope.GridCtrl.flattenedColumns_.length && $scope.config;

        if (canRenderRows) {
          return $scope.gridData.length;
        }

        return 0;
      },
      angular.bind(this,
          function (newCanRenderRows, oldCanRenderRows) {
            if (newCanRenderRows) {
              this.buildTableRows_(
                  $scope.gridData, this.flattenedColumns_, $scope.config.row);
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

    if (row.isEditPending) {
      row.save();
    }
  }
};

/**
 * @returns The immediate parent scope of this directive.
 */
MccGridController.prototype.getAppScope = function() {
  return this.scope_.$parent;
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

mccGridModule.directive('mccGrid', function () {
  return {
    restrict: 'E',
    scope: {
      config: '=',
      gridData: '=',
      gridApi: '='
    },
    templateUrl: 'templates/mcc-grid/mcc-grid.html',
    replace: true,
    controller: MccGridController,
    controllerAs: 'GridCtrl',
    link: function(scope, element, attrs, ctrl) {
      // Export this controller.
      if (attrs['gridApi'] && attrs['gridApi'] !== '') {
        scope.gridApi = ctrl;
      }
    }
  }
});

})();
