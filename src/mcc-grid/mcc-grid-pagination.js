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
    this.updatePagingationState_(targetPage);
    console.log('gotoPage state is ', this.getState())
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
    console.log('isFirstPageEnabled ', this.getState().page !== this.getState().firstPage)
    console.log('paging state is ', this.getState())
    return this.getState().page !== this.getState().firstPage;
  };

  MccGridPaginationController.prototype.isPrevPageEnabled = function() {
    console.log('isPrevPageEnabled ', this.getState().page !== this.getState().prevPage)
    return this.getState().page !== this.getState().prevPage;
  };

  MccGridPaginationController.prototype.isNextPageEnabled = function() {
    console.log('isNextPageEnabled ', this.getState().page !== this.getState().nextPage)
    return this.getState().page !== this.getState().nextPage;
  };

  MccGridPaginationController.prototype.isLastPageEnabled = function() {
    console.log('isLastPageEnabled ', this.getState().page !== this.getState().lastPage)
    return this.getState().page !== this.getState().lastPage;
  };

  return {
    restrict: 'A',
    replace: true,
    controller: MccGridPaginationController,
    controllerAs: 'PaginationCtrl',
    templateUrl: '../src/mcc-grid/mcc-grid-pagination.html'
  }
});
