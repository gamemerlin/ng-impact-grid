// an empty container for mcc.directives.grid namespace.
angular.module('mcc.directives.grid', []);

// Grid features
/**
 * Make name space mcc-
 * fixed headers
 * highlight column group
 *
 * row selection handler
 * row select
 * custom cell render
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

    var me = this;
    $scope.$watch('BodyCtrl.getAutoResize()',
        function (oldAutoResize, newAutoResize) {
          if (newAutoResize) {
            if (me.getTableConfig().autoHeightResizeWithoutWindowScroll) {
              me.bindWindowResizeForAutoHeight_(true);
            } else if (me.getTableConfig().autoHeightResize) {
              me.bindWindowResizeForAutoHeight_();
            }
          }
        });
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
    return this.getTableConfig().canScrollX;
  };

  /**
   * @returns {boolean} Whether this grid body can scroll on the Y axis.
   */
  MccGridBodyController.prototype.canScrollY = function() {
    return this.getTableConfig().canScrollY;
  };

  MccGridBodyController.prototype.getHeight = function() {
    return this.getTableConfig().bodyHeight;
  };

  MccGridBodyController.prototype.getAutoResize = function() {
    return this.getTableConfig().autoHeightResize ||
        this.getTableConfig().autoHeightResizeWithoutWindowScroll;
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

        var me = this;

        angular.element(this.window_).bind('resize', function() {
          var windowScrollTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;

          var positionRelativeToWindow = me.domUtils_.getOffsetFor(tableBodyContainer) - windowScrollTop,
              newBodyHeight = me.window_.innerHeight - positionRelativeToWindow;

          tableBodyContainer.css('height', newBodyHeight + 'px');
        });

        // Some edge cases load this table via ajax and makes
        // the initial firing of resize unpredicable. Wrap in a timeout
        // to guarantee this will resize after all other dom events.
        var me = this;
        this.timeout_(function() {
          console.log('angular.element(me.window_) ', angular.element(me.window_))
          angular.element(me.window_).triggerHandler('resize');
        });
  };

  return {
    restrict: 'E',
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
        if (rowConfig.canEdit) {
            this.canEdit = rowConfig.canEdit;
        }

        // Passing delete handler from the application to the model.
        if (rowConfig.deleteHandler) {
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

    var me = this;
    $scope.$watch('GridCtrl.getConfig().columns', function (oldDefs, newDefs) {
      if (newDefs && newDefs.length) {
        me.buildHeader_(newDefs);
      }
    });


    /**
     * TODO: Inject sticky header service
     * If isSticky window.onscroll service handler.
     */
    $scope.$watch('GridCtrl.getConfig().header.isSticky',
        function (oldIsSticky, newIsSticky) {
          if (newIsSticky) {
            me.bindWindowScrollForStickyHeaders_(me.element_)
          }
        });
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
    var header = angular.element(this.element_),
        tableBody,
        gridContainer = header.parent(),
        headerScrollTop = this.element_[0].getBoundingClientRect().top;

    var me = this;

    angular.element(this.window_).bind('scroll', function () {
      var isWindowPastHeader = me.domUtils_.scrollTop() > headerScrollTop;

      if (!tableBody) {
        tableBody = header.next().find('table');
      }

      var tableBodyRows = tableBody.find('tr'),
          lastRow = tableBodyRows[tableBodyRows.length - 1],
          lastRowOffsetTop = me.domUtils_.getOffsetFor(lastRow);

      if (isWindowPastHeader) {
        gridContainer.css('padding-top', header[0].offsetHeight + 'px');
        header.css({
          'position': 'fixed',
          'top': 0,
          'width': tableBody[0].offsetWidth
        });

        if (me.domUtils_.scrollTop() > lastRowOffsetTop - header[0].offsetHeight) {
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
    });
  };

  return {
    restrict: 'C',
    templateUrl: '../src/mcc-grid/mcc-grid-header.html',
    controller: MccGridHeaderController,
    controllerAs: 'HeaderCtrl'
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

    var me = this;

    $scope.$watch('config', function (oldConfig, newConfig) {
      if (newConfig) {
        me.scanForColumnOrderConfigs_(newConfig);
      }
    });

    // Set up a watch on whether we have both field orderings and
    // all the row data ready so we can render the grid.
    $scope.$watch(
        function () {
          var canRenderRows = $scope.gridData && $scope.gridData.length &&
              $scope.GridCtrl.columnOrdering_.length &&
              $scope.config && $scope.config.rows;

          if (canRenderRows) {
            return $scope.gridData.length;
          }

          return false;
        },
        function (oldCanRenderRows, newCanRenderRows) {
          if (newCanRenderRows) {
            me.buildTableRows_(
                $scope.gridData, me.columnOrdering_, $scope.config.rows);
          }
        });

    $scope.$on('sortColumn', function(event, field) {
      me.sortColumnBy_(event, field);
    });
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
   *      The list of rows to bind to. These rows are Row object wrappers around
   *      the grid data.
   */
  MccGridController.prototype.getRows = function () {
    return this.rows_;
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

    return Boolean(rowConfig.canEdit && rowConfig.canEdit() &&
        rowConfig.deleteHandler);
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
