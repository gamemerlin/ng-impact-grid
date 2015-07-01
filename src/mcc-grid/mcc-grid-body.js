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
