'use strict';

describe('Grid layout', function() {
  var $compile;
  var $scope;

  beforeEach(module('mcc.directives.grid'));

  // load test dependencies
  // ** The injector unwraps the underscores (_) from around the parameter names when matching
  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
  }));

  var HTML_TEMPLATE = '<mcc-grid ' +
      'data-grid-data="gridData" data-config="gridConfig"></mcc-grid>';

  describe('Mcc grid bindings and basic rendering', function(){
    beforeEach(inject(function(_$compile_, _$rootScope_){
      $scope.gridData = MOCK_DATA;
      $scope.gridConfig = MOCK_CONFIG;
    }));

    afterEach(function() {
      $scope.gridData = MOCK_DATA;
      $scope.gridConfig = MOCK_CONFIG;
    });

    describe('rendering the header', function() {
      it('should render a header', function() {
        var element = $compile(HTML_TEMPLATE)($scope);
        $scope.$digest();

        var header = $('.mcc-grid-header', element);

        // There should be just 1 row in this configuration.
        expect(header.find('tr').length).toBe(1);

        var THs = header.find('tr th');
        expect(THs.length).toBe(3);

        var colDefs = MOCK_CONFIG.columns;
        expect(THs.eq(0).text().trim()).
            toBe(colDefs[0].title);
        expect(THs.eq(0).hasClass('col-0')).toBe(true);
        expect(THs.eq(0).hasClass('header-0')).toBe(true);

        expect(THs.eq(1).text().trim()).
            toBe(colDefs[1].title);
        expect(THs.eq(1).hasClass('col-2')).toBe(true);
        expect(THs.eq(1).hasClass('header-2')).toBe(true);

        expect(THs.eq(2).text().trim()).
            toBe(colDefs[2].title);
        expect(THs.eq(2).hasClass('col-3')).toBe(true);
        expect(THs.eq(2).hasClass('header-3')).toBe(true);
      });

      it('should render a header column in the order specified ' +
          'by the column config', function() {
        // change the order of the columns.
        var testConfig  = {columns: [
          {
            css: {
              header: ['header-2'],
              cell: ['col-2']
            },
            field: 'telephone',
            isSortable: true,
            title: 'Phone'
          },
          {
            css: {
              header: ['header-0'],
              cell: ['col-0']
            },
            field: 'name',
            title: 'Name'
          },
          {
            css: {
              header: ['header-3'],
              cell: ['col-3']
            },
            field: 'zip',
            title: 'Zip'
          }
        ]};

        $scope.gridConfig = testConfig;

        var element = $compile(HTML_TEMPLATE)($scope);
        $scope.$digest();

        var header = $('.mcc-grid-header', element);

        // There should be just 1 row in this configuration.
        expect(header.find('tr').length).toBe(1);

        var THs = header.find('tr th');
        expect(THs.length).toBe(3);

        var colDefs = testConfig.columns;
        expect(THs.eq(0).text().trim()).
            toBe(colDefs[0].title);
        expect(THs.eq(0).hasClass('col-2')).toBe(true);
        expect(THs.eq(0).hasClass('header-2')).toBe(true);

        expect(THs.eq(1).text().trim()).
            toBe(colDefs[1].title);
        expect(THs.eq(1).hasClass('col-0')).toBe(true);
        expect(THs.eq(1).hasClass('header-0')).toBe(true);

        expect(THs.eq(2).text().trim()).
            toBe(colDefs[2].title);
        expect(THs.eq(2).hasClass('col-3')).toBe(true);
        expect(THs.eq(2).hasClass('header-3')).toBe(true);
      });

      it('should render a header with grouped columns', function() {
        // This config has grouped columns.
        var testConfig  = {columns: [
          {
            css: {
              header: ['header-0'],
              cell: ['col-0']
            },
            field: 'id',
            title: 'Id'
          },
          {
            css: {
              header: ['header-1'],
              cell: ['col-1']
            },
            field: 'name',
            title: 'Name'
          },
          {
            css: {
              header: ['header-2'],
              cell: ['col-2']
            },
            title: 'Personal Info',
            columns: [{
              css: {
                header: ['header-3'],
                cell: ['col-3']
              },
              field: 'telephone',
              isSortable: true,
              title: 'Phone'
            },
              {
                css: {
                  header: ['header-4'],
                  cell: ['col-4']
                },
                field: 'zip',
                title: 'Zip'
              }]
          }
        ]};

        $scope.gridConfig = testConfig;

        var element = $compile(HTML_TEMPLATE)($scope);
        $scope.$digest();

        var header = $('.mcc-grid-header', element);

        // There should be just 1 row in this configuration.
        expect(header.find('tr').length).toBe(2);

        var firstRowHeaders = header.find('tr:eq(0)').find('th');
        expect(firstRowHeaders.length).toBe(3);
        expect(firstRowHeaders.eq(0).text().trim()).toBe('Id');
        expect(firstRowHeaders.eq(0).hasClass('col-0')).toBe(true);
        expect(firstRowHeaders.eq(0).hasClass('header-0')).toBe(true);
        expect(firstRowHeaders.eq(1).text().trim()).toBe('Name');
        expect(firstRowHeaders.eq(1).hasClass('col-1')).toBe(true);
        expect(firstRowHeaders.eq(1).hasClass('header-1')).toBe(true);
        expect(firstRowHeaders.eq(2).text().trim()).toBe('Personal Info');
        expect(firstRowHeaders.eq(2).hasClass('col-2')).toBe(true);
        expect(firstRowHeaders.eq(2).hasClass('header-2')).toBe(true);

        var secondRowHeaders = header.find('tr:eq(1)').find('th');
        expect(secondRowHeaders.length).toBe(2);
        expect(secondRowHeaders.eq(0).text().trim()).toBe('Phone');
        expect(secondRowHeaders.eq(0).hasClass('col-3')).toBe(true);
        expect(secondRowHeaders.eq(0).hasClass('header-3')).toBe(true);
        expect(secondRowHeaders.eq(1).text().trim()).toBe('Zip');
        expect(secondRowHeaders.eq(1).hasClass('col-4')).toBe(true);
        expect(secondRowHeaders.eq(1).hasClass('header-4')).toBe(true);
      });
    });

    describe('rendering the table body', function() {
      it('should bind to the data passed to the row', function() {

        var element = $compile(HTML_TEMPLATE)($scope);
        $scope.$digest();

        var rowsElm = $('tbody tr', element);
        expect(rowsElm.length).toBe(10);

        for (var i=0, length = MOCK_DATA.length; i<length; i++) {
          var data = MOCK_DATA[i],
              row = rowsElm.eq(i);

          // Verify Data
          expect($('td', row).eq(0).text().trim()).
              toBe(data.name);
          expect($('td', row).eq(1).text().trim()).
              toBe(data.telephone);
          expect($('td', row).eq(2).text().trim()).
              toBe(data.zip);

          // Verify classes
          expect($('td', row).eq(0).hasClass('col-0')).
              toBe(true);
          expect($('td', row).eq(1).hasClass('col-2')).
              toBe(true);
          expect($('td', row).eq(2).hasClass('col-3')).
              toBe(true);
        }
      });

      it('should bind to the data passed to the row in the order ' +
          ' specified by the column configuration', function() {

        var testConfig  = {columns: [
          {
            css: {
              header: ['header-2'],
              cell: ['col-2']
            },
            field: 'telephone',
            isSortable: true,
            title: 'Phone'
          },
          {
            css: {
              header: ['header-3'],
              cell: ['col-3']
            },
            field: 'zip',
            title: 'Zip'
          },
          {
            css: {
              header: ['header-0'],
              cell: ['col-0']
            },
            field: 'name',
            title: 'Name'
          }
        ]};

        $scope.gridConfig = testConfig;

        var element = $compile(HTML_TEMPLATE)($scope);
        $scope.$digest();

        var rowsElm = $('tbody tr', element);
        expect(rowsElm.length).toBe(10);

        for (var i=0, length = MOCK_DATA.length; i<length; i++) {
          var data = MOCK_DATA[i],
              row = rowsElm.eq(i);

          // verify text.
          expect($('td', row).eq(0).text().trim()).
              toBe(data.telephone);
          expect($('td', row).eq(1).text().trim()).
              toBe(data.zip);
          expect($('td', row).eq(2).text().trim()).
              toBe(data.name);

          // verify classes
          expect($('td', row).eq(0).hasClass('col-2')).
              toBe(true);
          expect($('td', row).eq(1).hasClass('col-3')).
              toBe(true);
          expect($('td', row).eq(2).hasClass('col-0')).
              toBe(true);
        }
      });
    });

  });
});