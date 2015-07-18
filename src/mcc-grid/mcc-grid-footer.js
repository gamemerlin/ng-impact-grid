var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridFooter', function() {
  /**
   * @param $scope
   * @constructor
   */
  function MccGridPaginationController($scope) {
    this.scope_ = $scope;

    $scope.$watch('Footer.Ctrl.getConfig_()', angular.bind(
      this,
      function () {
        this.updateConfig_();
      }));
  }
  MccGridPaginationController.$inject = ['$scope'];

  /**
   * @returns {$scope.gridConfig.pagination} the pagination
   * configuration settings for the global grid config.
   * @private
   */
  MccGridPaginationController.prototype.getConfig_ = function() {
    return this.scope_.GridCtrl.getConfig().pagination;
  };

  MccGridPaginationController.prototype.getTotalCount = function() {
    if (!this.getConfig_().totalCount) {
      this.getConfig_().totalCount = this.scope_.GridCtrl.getAllRows().length;
    }

    return this.getConfig_().totalCount;
  };

  MccGridPaginationController.prototype.getPerPage = function() {
    var config = this.getConfig_();
    var DEFAULT_PER_PAGE = 10;

    // Take the per page if it is passed in. Else take the
    // first per page size if supplied. Default to 10 if
    // nothing is provided.
    config.perPage = config.perPage ? config.perPage :
        config.perPageSizes && config.perPageSizes.length ? config.perPageSizes[0] : DEFAULT_PER_PAGE;

    return config.perPage;
  };

  MccGridPaginationController.prototype.getPerPageSizes = function() {
    return this.getConfig_().perPageSizes;
  };

  MccGridPaginationController.prototype.setPageSize = function(pageLength) {
    this.getConfig_().perPage = pageLength;
    this.getConfig_().totalPages =
        Math.ceil(this.getTotalCount() / this.getConfig_().perPage);

    // Send user back to page 1
    this.getConfig_().page = 1;

    this.updateConfig_();
  };

  MccGridPaginationController.prototype.getTotalPages = function() {
    var config = this.getConfig_();
    config.totalPages = Math.ceil(this.getTotalCount() / this.getPerPage());

    return this.getConfig_().totalPages;
  };

  MccGridPaginationController.prototype.gotoPage = function(targetPage) {
    this.updateConfig_(targetPage);
    this.getPage(this.getConfig_());
  };

  MccGridPaginationController.prototype.updateConfig_ = function(targetPage) {
    var config = this.getConfig_();

    config.page = targetPage || config.page || 1;

    config.firstPage = 1;
    config.lastPage = this.getTotalPages();

    var newPrev = config.page - 1,
        newNext = config.page + 1;

    config.prevPage = Math.max(newPrev, 1);
    config.nextPage = Math.min(newNext, config.totalPages);
  };

  MccGridPaginationController.prototype.getPage = function(config) {


  };

  MccGridPaginationController.prototype.gotoFirstPage = function() {
    this.gotoPage(this.getConfig_().firstPage);
  };

  MccGridPaginationController.prototype.gotoLastPage = function() {
    this.gotoPage(this.getConfig_().lastPage);
  };

  MccGridPaginationController.prototype.gotoPrevPage = function() {
    this.gotoPage(this.getConfig_().prevPage);
  };

  MccGridPaginationController.prototype.gotoNextPage = function() {
    this.gotoPage(this.getConfig_().nextPage);
  };

  return {
    restrict: 'A',
    replace: true,
    controller: MccGridPaginationController,
    controllerAs: 'PaginationCtrl',
    templateUrl: '../src/mcc-grid/mcc-grid-footer.html'
  }
});
