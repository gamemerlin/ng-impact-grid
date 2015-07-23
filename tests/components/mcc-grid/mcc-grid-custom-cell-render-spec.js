'use strict';

describe('Grid custom cell template', function() {
  var $compile;
  var $scope;

  beforeEach(module('mcc.directives.grid'));

  // load test dependencies
  // ** The injector unwraps the underscores (_) from around the parameter names when matching
  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $scope = _$rootScope_.$new();

    $scope.gridData = angular.copy(MOCK_DATA);
    $scope.gridConfig = angular.copy(MOCK_CONFIG);
  }));

  var HTML_TEMPLATE = '<mcc-grid ' +
      'data-grid-data="gridData" data-config="gridConfig"></mcc-grid>';

  it('should render a custom cell template', function() {
    var telephoneColumnDef = $scope.gridConfig.columns[1];

    telephoneColumnDef.template = '<input ng-model="cell.value">';

    var element = $compile(HTML_TEMPLATE)($scope);
    $('body').append(element);
    $scope.$digest();

    var rowsElm = $('tbody tr', element);

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      expect(rowsElm.eq(i).find('td').eq(1).children().length).toBe(1);

      var telephoneInput = rowsElm.eq(i).find('td').eq(1).find('input');
      expect(telephoneInput.length).toBe(1);
    }
  });
});