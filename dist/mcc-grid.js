// an empty container for mcc.directives.grid namespace.
angular.module('mcc.directives.grid', []);

// Grid features
/**
 *
 * add pagination
 *  remote pagination
 *  remote sorting
 *  remote render
 *
 *
 * custom cell render
 *  column.template
 *  column.templateUrl
 *
 *
 * Tree data
 * tree: {
 *  childGetters: [(string|function)]
 * }
 *
 * highlight column group
 *
 * row selection handler
 * row select

 * sort
 * tree structure. Assume we have parent child relation already?
 * add class based on cell data condition
 * set column width
 * freeze columns / pinning panes
 *
 * Features implemented
 * bind to an object in the row
 * bind deep object to row
 * position fixed / floating headers
 * delete row
 * simple sort
 * custom css classes
 */
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
    templateUrl: '../src/mcc-grid/mcc-grid-body.html'
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

var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.factory('RowModel', ['CellModel', function(Cell){
    /**
     * Wraps the raw data of a row in a row object model for binding
     * purposes and also to preserve state outside of
     * the rendered DOM.
     *
     * @param rowData - The raw data for the row.
     * @param columnOrdering - An array of field orders.
     * @param rowConfig - The configuration for this row.
     * @constructor
     */
    function Row(rowData, columnOrdering, rowConfig) {
        this.data_ = rowData;
        this.cells_ = [];

        for (var i= 0, length=columnOrdering.length; i< length; i++) {
            var field = columnOrdering[i];

            if (typeof field === 'string') {
                this.cells_.push(new Cell(field, rowData[field]));
            } else if (typeof field === 'object') {
                this.cells_.push(new Cell(field.key, field.getter(rowData)));
            }
        }

        // Passing canEdit from the application to the model.
        if (rowConfig && rowConfig.canEdit) {
            this.canEdit = rowConfig.canEdit;
        }

        // Passing delete handler from the application to the model.
        if (rowConfig && rowConfig.deleteHandler) {
            this.deleteSelf = rowConfig.deleteHandler;
        }
    }

    /**
     * Gets the rows cell object models.
     * @returns {Array}
     */
    Row.prototype.getCells = function() {
        return this.cells_;
    };

    /**
     * Gets the the orginal dataset this model is wrapping.
     * @returns {Object}
     */
    Row.prototype.getData = function() {
        return this.data_;
    };

    return Row;
}]);
var mccGridModule = angular.module('mcc.directives.grid');


mccGridModule.directive('mccGridHeader', function () {
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
   * * Builds the column header out. Inspects the columnDefs to check
   * if we have column groups that need to be separated out between
   * the first or second rows.
   *
   * @param newDefs
   * @private
   */
  MccGridHeaderController.prototype.buildHeader_ = function (columnDefs) {
    this.hasGroupedColumns = this.scanForGroupedColumns_(columnDefs);
    if (this.hasGroupedColumns) {
      this.setRowSpans_(this.firstHeaderRow);
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
  MccGridHeaderController.prototype.setRowSpans_ = function (firstHeaderRows) {
    var HEADER_ROW_SPAN = 2;

    for (var i = 0, length = firstHeaderRows.length; i < length; i++) {
      if (firstHeaderRows[i].colSpan === undefined) {
        firstHeaderRows[i].rowSpan = HEADER_ROW_SPAN;
      }
    }
  };

  /**
   * @returns {number} The rowspan for empty place holder headers
   *     for delete and selection columns.
   */
  MccGridHeaderController.prototype.getTotalRowSpan = function() {
    return this.secondHeaderRow.length ? 2 : 1;
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

  return {
    restrict: 'C',
    templateUrl: '../src/mcc-grid/mcc-grid-header.html',
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

    $scope.$watch('Footer.Ctrl.getConfig()', angular.bind(
      this,
      function () {
        this.updateConfig_();
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

    // Local pagination.
    if (!this.getState().totalCount) {
      this.getState().totalCount = this.scope_.GridCtrl.getAllRows().length;
    }

    return this.getState().totalCount;
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
    this.updateConfig_(targetPage);
    console.log('gotoPage state is ', this.getState())
    if (this.getState().getPage) {
      this.getState().getPage(this.getState());
    }

  };

  MccGridPaginationController.prototype.updateConfig_ = function(targetPage) {
    var config = this.getState();

    config.page = targetPage || config.page || 1;

    config.firstPage = 1;
    config.lastPage = this.getTotalPages();

    var newPrev = config.page - 1,
        newNext = config.page + 1;

    config.prevPage = Math.max(newPrev, 1);
    config.nextPage = Math.min(newNext, config.totalPages);
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

  return {
    restrict: 'A',
    replace: true,
    controller: MccGridPaginationController,
    controllerAs: 'PaginationCtrl',
    templateUrl: '../src/mcc-grid/mcc-grid-pagination.html'
  }
});

var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridTd', function() {
  return {
    restrict: 'C',
    link: function(scope, element, attrs) {
      // Add custom css class during link. These classes
      // are not dynamic, we are adding at link time to avoid
      // an ng-class binding on each cell.
      if (scope.GridCtrl.cellCssClasses[scope.cell.field]) {
        element.addClass(scope.GridCtrl.cellCssClasses[scope.cell.field].join(' '));
      }
    }
  }
});
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

      if (scope.column.css) {
        element.addClass(scope.column.css.header.join(' '));
        element.addClass(scope.column.css.cell.join(' '));
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
    var paginationState = this.getConfig().pagination;

    return this.getAllRows().slice(
        (paginationState.page - 1) * paginationState.perPage,
        paginationState.page * paginationState.perPage);
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
    templateUrl: '../src/mcc-grid/mcc-grid.html',
    replace: true,
    controller: MccGridController,
    controllerAs: 'GridCtrl'
  }
});

(function() {
"use strict";

var dialogModule = angular.module("mcc.components.dialog", []);

/**
 * A singleton service to create and manage the life
 * cycle of a modal dialog's backdrop. Meant to be shared
 * across multiple instances of dialog components.
 * @param $rootScope
 * @param $document
 * @param $compile
 * @constructor
 */
BackdropService.$inject = ['$rootScope', '$document', '$compile'];

function BackdropService($rootScope, $document, $compile) {
  this.compile_ = $compile;
  this.document_ = $document;

  this.isVisible_ = false;
  this.isCreated_ = false;

  // Create an isolate scope for this backdrop to bind
  // to and set this service as the controller.
  var backdropScope = $rootScope.$new(true);
  backdropScope.ctrl = this;
  this.scope_ = backdropScope;
}

/**
 * Compile the backdrop template to an isolate scope and
 * append it to the BODY element.
 * @private
 */
BackdropService.prototype.createBackdrop = function() {
  var BACKDROP_HTML =
      '<div class="modal-backdrop" ng-class="{\'fade in\': ctrl.isVisible()}"></div>';

  var element = this.compile_(BACKDROP_HTML)(this.scope_);

  // Append the backdrop to the body.
  angular.element(this.document_).
      find('body').
      append(element);

  this.backdropElement_ = element;

  this.isCreated_ = true;
};

BackdropService.prototype.showBackdrop = function() {
  if (!this.isCreated_) {
    this.createBackdrop();
  }

  this.isVisible_ = true;
};

BackdropService.prototype.hideBackdrop = function() {
  this.isVisible_ = false;
};

BackdropService.prototype.isVisible = function() {
  return this.isVisible_;
};

BackdropService.prototype.destroy = function() {
  this.backdropElement_.remove();

  this.backdropElement_ = null;

  this.isCreated_ = false;
};

/**
 * @param $rootScope
 * @param $compile
 * @param $document
 * @param mccBackdropService
 * @returns {Function} A constructor for the dialog object.
 * @constructor
 */
DialogFactory.inject = ['$rootScope', '$compile', '$document', '$timeout', 'mccBackdropService'];

function DialogFactory($rootScope, $compile, $document, $timeout, mccBackdropService) {
  /**
   * Constructor for a dialog component. Injectables are provided
   * by the factory wrapper.
   *
   * @param config
   * @param appScope
   * @constructor
   */
  function DialogConstructor(config, appScope) {
    this.config_ = config;
    this.backdropService_ = mccBackdropService;

    var modalScope = $rootScope.$new(true);
    modalScope.modalCtrl = this;

    this.scope_ = modalScope;
    this.appScope_ = appScope || modalScope;

    this.isVisible_ = false;

    this.isDialogCreated_ = false;
    this.dialog_;
    this.dialogContent_;

    this.bindEscape_();
    this.createDialog_();

    if (config.buttons && config.buttons.length) {
      this.ensureDefaultClickHandler_();
    }

    // Clean up this modal if we leave this page or
    // if this scope somehow gets destroyed.
    this.scope_.$on('$destroy', angular.bind(this, function() {
      this.backdropService_.destroy();
      angular.element($document).find('body').
          off('keyup', this.handleEscPress_);

      this.dialog_.remove();
      this.dialog_ = null;
    }));
  }

  DialogConstructor.prototype.createDialog_ = function() {
    if (this.isDialogCreated_) {
      return;
    }

    if (this.config_.showBackdrop) {
      this.backdropService_.createBackdrop();
    }

    this.dialogConent_ = angular.element('<div class="modal-content"></div>');

    var dialogHtml = angular.
        element('<div class="mcc-modal modal fade" ' +
        'id="{{modalCtrl.getDomId()}}" ' +
        'ng-class="{\'in\': modalCtrl.isVisible()}" ' +
        'tabindex="-1" role="dialog" aria-hidden="false"></div>')
        .append(
        angular.element('<div class="modal-dialog"></div>')
            .append(this.dialogConent_));

    this.dialog_ = $compile(angular.element(dialogHtml))(this.scope_);

    this.createDialogContent();

    angular.element($document).find('body').append(this.dialog_);

    this.isDialogCreated_ = true;
  };

  /**
   * Can be used publicly for use cases where one wants to reuse
   * a modal in different contexts, for example in a grid app
   * where each cell click opens up it's own version of a modal
   *
   * @param targetScope - A specific scope to bind the body template to.
   */
    // TODO - support templateUrl in configs and wrap this in and $http.get
  DialogConstructor.prototype.createDialogContent = function(targetScope) {
    this.dialogConent_.empty();

    // Compile and append header.
    this.dialogConent_.append(this.compileHeader_());
    // Compile and append body.
    this.dialogConent_.append(this.compileBody_(targetScope));
    // Compile and append footer.
    this.dialogConent_.append(this.compileFooter_());
  };

  /**
   * @returns {Element} A header compiled and linked to the dialog scope.
   * @private
   */
  DialogConstructor.prototype.compileHeader_ = function() {
    var element = angular.element(
        '<div class="modal-header" ng-if="modalCtrl.getTitle()">' +
        ' <span class="modal-title" ng-bind="modalCtrl.getTitle()"></span></div>');

    return $compile(element)(this.scope_);
  };

  /**
   * @param targetScope - A specific scope context to bind this body
   *     content to.
   * @returns {Element} - A body compiled and link to the app scope.
   * @private
   */
  DialogConstructor.prototype.compileBody_ = function(targetScope) {
    var element = angular.element('<div class="modal-body">' +
        this.config_.template + '</div>');

    return $compile(element)(targetScope || this.appScope_);
  };

  /**
   * @returns {Element} - A footer compiled to the dialog scope.
   * @private
   */
  DialogConstructor.prototype.compileFooter_ = function() {
    var element = angular.element(
        '<div class="modal-footer" ng-if="modalCtrl.hasButtons()">' +
        ' <button type="button" class="btn" ' +
        '     ng-repeat="button in modalCtrl.getButtons()" ' +
        '     ng-click="button.clickHandler()" ' +
        '     ng-disabled="button.disabledHandler()" ' +
        '     ng-class="button.classes">{{ button.title }}</button>' +
        '</div>');

    return $compile(element)(this.scope_);
  };

  DialogConstructor.prototype.getDomId = function() {
    return this.config_.domId;
  };

  DialogConstructor.prototype.getTitle = function() {
    return this.config_.title;
  };

  DialogConstructor.prototype.getButtons = function() {
    return this.config_.buttons;
  };

  DialogConstructor.prototype.hasButtons = function() {
    return this.config_.buttons && this.config_.buttons.length;
  };

  DialogConstructor.prototype.getDialogButtons = function() {
    return this.config_.buttons;
  };

  DialogConstructor.prototype.show = function() {
    if (this.config_.showBackdrop) {
      this.backdropService_.showBackdrop();
    }

    this.isVisible_ = true;
  };

  DialogConstructor.prototype.hide = function() {
    if (this.config_.showBackdrop) {
      this.backdropService_.hideBackdrop();
    }

    this.isVisible_ = false;
  };

  DialogConstructor.prototype.isVisible = function() {
    return this.isVisible_;
  };

  DialogConstructor.prototype.handleEscPress_ = function(e) {
    if (e.which == 27) {
      this.hide();
      // Digest modal and backdrop scopes.
      this.scope_.$digest();
      this.backdropService_.scope_.$digest();
    }
  };

  DialogConstructor.prototype.bindEscape_ = function() {
    angular.element($document).find('body').
        on('keyup', angular.bind(this, this.handleEscPress_));
  };

  /**
   * Checks each button to make sure it has a default click handler.
   * The default click handler simply closes the modal.
   * @private
   */
  DialogConstructor.prototype.ensureDefaultClickHandler_ = function() {
    var defaultClickHandler = angular.bind(this, function() {
      this.hide();
    });

    for (var i= 0,length = this.config_.buttons.length; i<length; i++) {
      var button = this.config_.buttons[i];
      if (!button.clickHandler) {
        button.clickHandler = defaultClickHandler;
      }
    }
  };

  return DialogConstructor;
}

dialogModule
    .service('mccBackdropService', BackdropService)
    .factory('mccDialog', DialogFactory);
})();
