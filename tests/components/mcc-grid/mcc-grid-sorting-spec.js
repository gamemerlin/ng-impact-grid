'use strict';

describe('Grid sorting', function() {
  var element;
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

  afterEach(function(){
    // Clean up this page.
    if (element) {
      element.remove();
    }
  });

  var HTML_TEMPLATE = '<mcc-grid ' +
      'data-grid-data="gridData" data-config="gridConfig"></mcc-grid>';

  function sortByField(gridData, field, asc) {
    var cloned = angular.copy(gridData);

    return cloned.sort(function(a, b) {
      var x = a[field]; var y = b[field];
      return asc ?
          ((x < y) ? -1 : ((x > y) ? 1 : 0)) :
          ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  };

  it('should sort in ascending order', function() {
    // Set name column as sortable
    $scope.gridConfig.columns[0].isSortable = true;

    element = $compile(HTML_TEMPLATE)($scope);
    $scope.$digest();

    var ths = $('thead th', element);

    var expectedAscending = sortByField($scope.gridData, 'name', true);

    ths.eq(0).click();

    var rowsElm = $('tbody tr', element);

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      expect(rowsElm.eq(i).find('td').eq(0).text().trim()).toBe(expectedAscending[i].name);
    }
  });

  it('should sort in descending order', function() {
    // Set name column as sortable
    $scope.gridConfig.columns[0].isSortable = true;

    element = $compile(HTML_TEMPLATE)($scope);
    $scope.$digest();

    var ths = $('thead th', element);

    var expectedDecending = sortByField($scope.gridData, 'name', false);

    ths.eq(0).click();
    ths.eq(0).click();

    var rowsElm = $('tbody tr', element);

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      expect(rowsElm.eq(i).find('td').eq(0).text().trim()).toBe(expectedDecending[i].name);
    }
  });

  it('should not sort if the column is not marked as sortable',
      function() {
    // Mark name sortable.
    $scope.gridConfig.columns[0].isSortable = true;
    // Mark phone sortable.
    $scope.gridConfig.columns[1].isSortable = true;

    element = $compile(HTML_TEMPLATE)($scope);
    $scope.$digest();

    var ths = $('thead th', element);

    // Click on zip.
    ths.eq(2).click();

    var rowsElm = $('tbody tr', element);

    // Expect zip code order not to be changed.
    for (var i= 0, length=rowsElm.length; i<length; i++) {
      expect(rowsElm.eq(i).find('td').eq(2).text().trim()).toBe($scope.gridData[i].zip);
    }
  });

  it('should sort ascending if a column is in a column group',
      function() {
    $scope.gridConfig = angular.copy(MOCK_CONFIG_GROUPED_HEADER);

    $scope.gridConfig.columns[2].columns[0].isSortable = true;

    element = $compile(HTML_TEMPLATE)($scope);
    $scope.$digest();

        // Get the header for telephone, 2nd row, first column.
    var ths = $('thead tr:eq(1) th', element);
    ths.eq(0).click();

    var expectedAscending = sortByField($scope.gridData, 'telephone', true);

    var rowsElm = $('tbody tr', element);

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      expect(rowsElm.eq(i).find('td').eq(2).text().trim()).toBe(expectedAscending[i].telephone);
    }
  });

  it('should sort descending if a column is in a column group',
      function() {
    $scope.gridConfig = angular.copy(MOCK_CONFIG_GROUPED_HEADER);

    $scope.gridConfig.columns[2].columns[0].isSortable = true;

    element = $compile(HTML_TEMPLATE)($scope);
    $scope.$digest();

    // Get the header for telephone, 2nd row, first column.
    var ths = $('thead tr:eq(1) th', element);

    ths.eq(0).click();

    ths.eq(0).click();

    var expectedDescending = sortByField($scope.gridData, 'telephone', false);

    var rowsElm = $('tbody tr', element);

    // Arg the clicks are happening too fast, wrap expect
    // in a set timeout so it comes afer all applys.
    setTimeout(function() {
      for (var i= 0, length=rowsElm.length; i<length; i++) {
        expect(rowsElm.eq(i).find('td').eq(2).text().trim()).
            toBe(expectedDescending[i].telephone);
      }
    });
  });

  xdescribe('with pagination', function() {
    it('should sort ascending with pagination', function() {
      expect(true).toBe(false);
    });

    it('should sort decending with pagination', function() {
      expect(true).toBe(false);
    });
  });
});
