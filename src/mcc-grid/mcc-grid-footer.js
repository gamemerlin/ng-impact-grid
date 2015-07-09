var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.directive('mccGridFooter', function() {
  /**
   * @param $scope
   * @constructor
   */
  function MccGridFooterController($scope) {
    this.scope_ = $scope;
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

      //page: listMetaData.page,
      //inputPage: listMetaData.page,
      //perPage: listMetaData.per_page,
      //totalCount: listMetaData.total_items,
      //totalPages: listMetaData.total_pages,
      //firstPage: listMetaData.first_params,
      //prevPage: listMetaData.previous_params,
      //nextPage: listMetaData.next_params,
      //lastPage: listMetaData.last_params,

  MccGridFooterController.prototype.getTotalCount = function() {
    if (!this.getConfig_().totalCount) {
      this.getConfig_().totalCount = this.scope_.GridCtrl.getRows().length;
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
        config.perPageSizes && onfig.perPageSizes.length ? config.perPageSizes[0] : DEFAULT_PER_PAGE;

    return config.perPage;
  };

  MccGridFooterController.prototype.getTotalPages = function() {
    var config = this.getConfig_();
    config.totalPages = config.totalPages ?
        config.totalPages : this.getTotalCount() / this.getPerPage();

    return this.getConfig_().totalPages;
  };

  MccGridFooterController.prototype.gotoPage = function(targetPage) {
    this.updateConfig_(targetPage);
    this.getPage(this.getConfig_());
  };

  MccGridFooterController.prototype.updateConfig_ = function(targetPage) {
    var config = this.getConfig_();

    config.page = targetPage;
    config.firstPage = 1;
    config.lastPage = config.lastPage ? config.lastPage : this.getTotalPages();

    var newPrev = targetPage - 1,
        newNext = targetPage + 1;

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
    restrict: 'E',
    replace: true,
    controller: MccGridFooterController,
    controllerAs: 'FooterCtrl',
    templateUrl: '../src/mcc-grid/mcc-grid-footer.html'
  }
});
