'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
  $scope.deleteItemFromController = function(item) {
    console.log('deleting item from app scope', item);
  };

  $scope.canIDeleteThis = function(item) {
    return true;
  };

  $scope.gridApi;

  $scope.gridConfig = {
    columns: [
      {
        css: {
          header: ['header-0'],
          cell: ['col-0']
        },
        field: 'name',
        isSortable: true,
        title: 'Name'
      },
      {
        css: {
          header: ['header-1'],
          cell: ['col-1']
        },
        title: 'Personal Info',
        columns: [
          {
            css: {
              header: ['header-2'],
              cell: ['col-2']
            },
            field: 'zip',
            title: 'Zip'
          },
          {
            css: {
              header: ['header-3'],
              cell: ['col-3']
            },
            field: 'telephone',
            isSortable: true,
            template: '<input ng-model="cell.value" ng-blur="cell.save()">',
            title: 'Phone'
          }
        ]
      },
      {
        css: {
          header: ['header-4'],
          cell: ['col-4']
        },
        field: {
          key: 'code',
          getter: function(data) {
            return data.activity.code;
          },
          setter: function(data, value) {
            data.activity.code = value;
          }
        },
        template: '<input ng-model="cell.value" ng-blur="cell.save()">',
        isSortable: true,
        title: 'Account Code'
      },
      {
        field: 'delete',
        css: {
          cell: ['mcc-delete-cell']
        },
        template: '<a href="" class="mcc-delete-row-btn" ng-disabled="!row.canEdit(row)" ng-click="row.deleteRow(row)" ng-class="{\'delete-in-progress\': row.deleteInProgress }"></a>'
      }
    ],
    header: {
      isSticky: true
    },
    pagination: {
      perPageSizes: [5, 10, 25, 50, 100]
    },
    row: {
      rowApi: {
        deleteInProgress: false,
        canEdit: function(row) {
          return $scope.canIDeleteThis(row);
        },
        deleteRow: function(row) {
          row.deleteInProgress = true;
          $scope.deleteItemFromController(row)
        }
      }
    },
    table: {
      autoHeightResize: false,
      autoHeightResizeWithoutWindowScroll: true,
      canScrollX: false,
      canScrollY: true,
      bodyHeight: 100
    }
  };

  $scope.gridData = [
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
      name: 'Katy Perry 2',
      telephone: '999 999 9999',
      zip: '90000',
      activity: {
        code: '9iii',
        desc: 'katy perry Id'
      }
    },
    {
      name: 'Katy Perry 3',
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
}]);