'use strict';

describe('Grid layout', function() {
  var $compile;
  var $scope;

  beforeEach(module('mcc.directives.grid'));

  // load the templates
  beforeEach(module(
      '../src/mcc-grid/mcc-grid.html',
      '../src/mcc-grid/mcc-grid-body.html',
      '../src/mcc-grid/mcc-grid-header.html'));

  // load test dependencies
  // ** The injector unwraps the underscores (_) from around the parameter names when matching
  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
  }));

  var HTML_TEMPLATE = '<mcc-grid ' +
      'data-grid-data="gridData" data-config="gridConfig"></mcc-grid>';

  var MOCK_DATA = [
    {
      name: 'Bill Gates',
      telephone: '111 111 1111',
      zip: '1000',
      activity: {
        code: '1aaa',
        desc: 'Bill Gates Id'
      }
    },
    {
      name: 'Larry Page',
      telephone: '222 222 2222',
      zip: '2000',
      activity: {
        code: '2bbb',
        desc: 'Larry Page Id'
      }
    },
    {
      name: 'Elon Musk',
      telephone: '333 333 3333',
      zip: '3000',
      activity: {
        code: '3ccc',
        desc: 'Elon Musk Id'
      }
    },
    {
      name: 'Marissa Mayer',
      telephone: '444 444 4444',
      zip: '4000',
      activity: {
        code: '4ddd',
        desc: 'Marissa Mayer Id'
      }
    },
    {
      name: 'Mark Zuckerberg',
      telephone: '555 555 5555',
      zip: '5000',
      activity: {
        code: '5eeee',
        desc: 'Mark Zuckerberg Id'
      }
    },
    {
      name: 'Lawrence ellison',
      telephone: '666 666 6666',
      zip: '6000',
      activity: {
        code: '6fff',
        desc: 'Lawrence ellison Id'
      }
    },
    {
      name: 'Tom Hanks',
      telephone: '777 777 7777',
      zip: '7000',
      activity: {
        code: '7ggg',
        desc: 'TH Id'
      }
    },
    {
      name: 'Jennifer Lawrence',
      telephone: '888 888 8888',
      zip: '8000',
      activity: {
        code: '8hhh',
        desc: 'Jennifer Lawrence Id'
      }
    },
    {
      name: 'Katy Perry',
      telephone: '999 999 9999',
      zip: '90000',
      activity: {
        code: '9iii',
        desc: 'katy perry Id'
      }
    },
    {
      name: 'Lawrence ellison',
      telephone: '666 666 6666',
      zip: '6000',
      activity: {
        code: '6fff',
        desc: 'Lawrence ellison Id'
      }
    }
  ];

  var MOCK_CONFIG = {
    columns: [
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
          header: ['header-1'],
          cell: ['col-1']
        },
        title: 'Personal Info'
      },
      {
        css: {
          header: ['header-2'],
          cell: ['col-3']
        },
        field: 'telephone',
        isSortable: true,
        title: 'Phone'
      }
    ]
  };

  describe('Mcc grid bindings and basic rendering', function(){
    beforeEach(inject(function(_$compile_, _$rootScope_){
      $scope.gridData = MOCK_DATA;
      $scope.gridConfig = MOCK_CONFIG;
    }));

    it('should render a header', function() {

    });

    it('should bind to the data passed to the row', function() {

      var element = $compile(HTML_TEMPLATE)($scope);
      $scope.$digest();

      expect($('tbody tr', element).length).toBe(10);
    });

  });
});