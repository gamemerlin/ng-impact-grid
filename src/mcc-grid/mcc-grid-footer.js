var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridFooter', function() {
  /**
   * @param $scope
   * @constructor
   */
  function MccGridFooterController($scope) {
    this.scope_ = $scope;

    var me = this;

    $scope.$watch('Footer.Ctrl.getConfig_()', function () {
      me.updateConfig_();
    });
  }
  MccGridFooterController.$inject = ['$scope'];

  /**
   * @returns {$scope.gridConfig.pagination} the pagination
   * configuration settings for the global grid config.
   * @private
   */
  MccGridFooterController.prototype.getConfig_ = function() {
    return this.scope_.GridCtrl.getConfig().pagination;
  };

  MccGridFooterController.prototype.getTotalCount = function() {
    if (!this.getConfig_().totalCount) {
      this.getConfig_().totalCount = this.scope_.GridCtrl.getAllRows().length;
    }

    return this.getConfig_().totalCount;
  };

  MccGridFooterController.prototype.getPerPage = function() {
    var config = this.getConfig_();
    var DEFAULT_PER_PAGE = 10;

    // Take the per page if it is passed in. Else take the
    // first per page size if supplied. Default to 10 if
    // nothing is provided.
    config.perPage = config.perPage ? config.perPage :
        config.perPageSizes && config.perPageSizes.length ? config.perPageSizes[0] : DEFAULT_PER_PAGE;

    return config.perPage;
  };

  MccGridFooterController.prototype.getPerPageSizes = function() {
    return this.getConfig_().perPageSizes;
  };

  MccGridFooterController.prototype.setPageSize = function(pageLength) {
    this.getConfig_().perPage = pageLength;
    this.getConfig_().totalPages =
        Math.ceil(this.getTotalCount() / this.getConfig_().perPage);

    // Send user back to page 1
    this.getConfig_().page = 1;

    this.updateConfig_();
  };

  MccGridFooterController.prototype.getTotalPages = function() {
    var config = this.getConfig_();
    config.totalPages = Math.ceil(this.getTotalCount() / this.getPerPage());

    return this.getConfig_().totalPages;
  };

  MccGridFooterController.prototype.gotoPage = function(targetPage) {
    this.updateConfig_(targetPage);
    this.getPage(this.getConfig_());
  };

  MccGridFooterController.prototype.updateConfig_ = function(targetPage) {
    var config = this.getConfig_();

    config.page = targetPage || config.page || 1;

    config.firstPage = 1;
    config.lastPage = this.getTotalPages();

    var newPrev = config.page - 1,
        newNext = config.page + 1;

    config.prevPage = Math.max(newPrev, 1);
    config.nextPage = Math.min(newNext, config.totalPages);
  };

  MccGridFooterController.prototype.getPage = function(config) {


  };

  MccGridFooterController.prototype.gotoFirstPage = function() {
    this.gotoPage(this.getConfig_().firstPage);
  };

  MccGridFooterController.prototype.gotoLastPage = function() {
    this.gotoPage(this.getConfig_().lastPage);
  };

  MccGridFooterController.prototype.gotoPrevPage = function() {
    this.gotoPage(this.getConfig_().prevPage);
  };

  MccGridFooterController.prototype.gotoNextPage = function() {
    this.gotoPage(this.getConfig_().nextPage);
  };

  return {
    restrict: 'A',
    replace: true,
    controller: MccGridFooterController,
    controllerAs: 'FooterCtrl',
    templateUrl: '../src/mcc-grid/mcc-grid-footer.html'
  }
});
