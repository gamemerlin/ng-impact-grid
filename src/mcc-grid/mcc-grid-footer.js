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

  return {
    restrict: 'E',
    replace: true,
    controller: MccGridFooterController,
    controllerAs: 'FooterCtrl',
    templateUrl: '../src/mcc-grid/mcc-grid-footer.html'
  }
});
