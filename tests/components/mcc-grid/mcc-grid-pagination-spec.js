'use strict';

describe('Grid pagination', function() {
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

    $scope.gridConfig.pagination = {
      perPageSizes: [2, 5, 10]
    };

    element = $compile(HTML_TEMPLATE)($scope);
    $scope.$digest();
  }));

  afterEach(function(){
    // Clean up this page.
    if (element) {
      element.remove();
    }
  });

  var HTML_TEMPLATE = '<mcc-grid ' +
      'data-grid-data="gridData" data-config="gridConfig"></mcc-grid>';

  it('should render a pagination control', function() {
    var paginator = $('.mcc-grid-pagination', element);

    // General structure
    expect(paginator.length).toBe(1);
    expect($('.total-results', paginator).length).toBe(1);
    expect($('.per-page', paginator).length).toBe(1);
    expect($('.controls', paginator).length).toBe(1);

    // Total results
    expect($('.per-page li', paginator).length).toBe(3);
    expect($('.per-page li:eq(0)', paginator).text().trim()).toBe('2');
    expect($('.per-page li:eq(1)', paginator).text().trim()).toBe('5');
    expect($('.per-page li:eq(2)', paginator).text().trim()).toBe('10');
    expect($('.per-page li:eq(0) a', paginator).hasClass('selected')).toBe(true);

    // Per page controls
    expect($('.total-results b', paginator).text()).toBe('10');

    // Right side controls.
    expect($('.controls .first', paginator).length).toBe(1);
    expect($('.controls .previous', paginator).length).toBe(1);
    expect($('.controls .next', paginator).length).toBe(1);
    expect($('.controls .last', paginator).length).toBe(1);
    expect($('.controls input', paginator).length).toBe(1);
    expect($('.controls .total-pages', paginator).text()).toBe('5');
  });

  it('should navigate a page using the input', function() {
    var paginator = $('.mcc-grid-pagination', element);

    var rowsElm = $('tbody tr', element);

    expect(rowsElm.length).toBe(2);

    // Expect first page results to be valid.
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);

    // Expect page 3 to be valid.
    $('.controls input', paginator).val(3);
    $('.controls input', paginator).trigger('change');
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[4].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[5].name);

    // Expect page 3 to be valid.
    $('.controls input', paginator).val(5);
    $('.controls input', paginator).trigger('change');
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[8].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[9].name);
  });

  it('should navigate not navigate to a page with invalid input',
      function() {
    var paginator = $('.mcc-grid-pagination', element);

    var rowsElm = $('tbody tr', element);

    expect(rowsElm.length).toBe(2);

    // Expect first page results to be valid.
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);

    // Should not change page
    $('.controls input', paginator).val('abcd');
    $('.controls input', paginator).trigger('change');
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);

    // Should not change page
    $('.controls input', paginator).val(1.2);
    $('.controls input', paginator).trigger('change');
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);
  });

  it('should navigate not navigate to a page less than 1',
      function() {
    var paginator = $('.mcc-grid-pagination', element);

    var rowsElm = $('tbody tr', element);

    expect(rowsElm.length).toBe(2);

    // Expect first page results to be valid.
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);

    // Should not change page
    $('.controls input', paginator).val(0);
    $('.controls input', paginator).trigger('change');
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);

    // Should not change page
    $('.controls input', paginator).val(-1);
    $('.controls input', paginator).trigger('change');
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);
  });

  it('should navigate not navigate to a page greater than max',
      function() {
    var paginator = $('.mcc-grid-pagination', element);

    var rowsElm = $('tbody tr', element);

    expect(rowsElm.length).toBe(2);

    // Expect first page results to be valid.
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);

    // Should just go to last page
    $('.controls input', paginator).val(6);
    $('.controls input', paginator).trigger('change');
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[8].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[9].name);

    // Should not change page
    $('.controls input', paginator).val(10);
    $('.controls input', paginator).trigger('change');
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[8].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[9].name);
  });

  it('should navigate to the next page', function() {
    var paginator = $('.mcc-grid-pagination', element);

    var rowsElm = $('tbody tr', element);

    expect(rowsElm.length).toBe(2);

    // Expect first page results to be valid.
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);

    // Go to next page (2)
    $('.controls .next', paginator).click();
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[2].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[3].name);

    // Go to next page (3)
    $('.controls .next', paginator).click();
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[4].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[5].name);
  });

  it('should navigate to the prev page', function() {
    var paginator = $('.mcc-grid-pagination', element);

    // Go to the last page.
    $('.controls .last', paginator).click();
    var rowsElm = $('tbody tr', element);
    expect(rowsElm.length).toBe(2);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[8].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[9].name);

    // Go to next page (2)
    $('.controls .previous', paginator).click();
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[6].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[7].name);

    // Go to next page (3)
    $('.controls .previous', paginator).click();
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[4].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[5].name);
  });

  it('should navigate to the first or last page', function() {
    var paginator = $('.mcc-grid-pagination', element);

    // On first page.
    var rowsElm = $('tbody tr', element);
    expect(rowsElm.length).toBe(2);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);
    expect($('.controls .first', paginator).is(':disabled')).toBe(true);
    expect($('.controls .previous', paginator).is(':disabled')).toBe(true);
    expect($('.controls .last', paginator).is(':disabled')).toBe(false);
    expect($('.controls .next', paginator).is(':disabled')).toBe(false);

    // Go to the last page.
    $('.controls .last', paginator).click();
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[8].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[9].name);
    expect($('.controls .first', paginator).is(':disabled')).toBe(false);
    expect($('.controls .previous', paginator).is(':disabled')).toBe(false);
    expect($('.controls .last', paginator).is(':disabled')).toBe(true);
    expect($('.controls .next', paginator).is(':disabled')).toBe(true);

    // Go back to first page.
    $('.controls .first', paginator).click();
    rowsElm = $('tbody tr', element);
    expect(rowsElm.eq(0).find('td:eq(0)').text().trim()).toBe($scope.gridData[0].name);
    expect(rowsElm.eq(1).find('td:eq(0)').text().trim()).toBe($scope.gridData[1].name);
    expect($('.controls .first', paginator).is(':disabled')).toBe(true);
    expect($('.controls .previous', paginator).is(':disabled')).toBe(true);
    expect($('.controls .last', paginator).is(':disabled')).toBe(false);
    expect($('.controls .next', paginator).is(':disabled')).toBe(false);
  });

  it('should change the number of pages when selecting a ' +
      'different per page view', function() {
    var paginator = $('.mcc-grid-pagination', element);
    var rowsElm = $('tbody tr', element);
    expect(rowsElm.length).toBe(2);
    expect($('.per-page li:eq(0)', paginator).text().trim()).toBe('2');
    expect($('.per-page li:eq(0) a', paginator).hasClass('selected')).toBe(true);
    expect($('.controls .total-pages', paginator).text()).toBe('5');

    // Click on per page 5.
    $('.per-page li:eq(1) a', paginator).click();
    rowsElm = $('tbody tr', element);
    expect(rowsElm.length).toBe(5);
    expect($('.per-page li:eq(1)', paginator).text().trim()).toBe('5');
    expect($('.per-page li:eq(1) a', paginator).hasClass('selected')).toBe(true);
    expect($('.controls .total-pages', paginator).text()).toBe('2');

    // Click on per page 10.
    $('.per-page li:eq(2) a', paginator).click();
    rowsElm = $('tbody tr', element);
    expect(rowsElm.length).toBe(10);
    expect($('.per-page li:eq(2)', paginator).text().trim()).toBe('10');
    expect($('.per-page li:eq(2) a', paginator).hasClass('selected')).toBe(true);
    expect($('.controls .total-pages', paginator).text()).toBe('1');
  });

  it('should disable all controll buttons when all rows are showing',
      function() {
    // Click on per page 10.
    var paginator = $('.mcc-grid-pagination', element);
    $('.per-page li:eq(2) a', paginator).click();

    var paginator = $('.mcc-grid-pagination', element);
    var rowsElm = $('tbody tr', element);

    expect(rowsElm.length).toBe(10);
    expect($('.controls .total-pages', paginator).text()).toBe('1');
    expect($('.controls .first', paginator).is(':disabled')).toBe(true);
    expect($('.controls .previous', paginator).is(':disabled')).toBe(true);
    expect($('.controls .last', paginator).is(':disabled')).toBe(true);
    expect($('.controls .next', paginator).is(':disabled')).toBe(true);
  });
});
