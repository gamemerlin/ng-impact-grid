'use strict';

describe('Grid edit and save', function() {
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

  afterEach(function() {
    if (element) {
      element.remove();
    }
  });

  var HTML_TEMPLATE = '<mcc-grid ' +
      'data-grid-data="gridData" data-config="gridConfig"></mcc-grid>';

  it('should edit a cell value using a custom renderer', function() {
    var telephoneColumnDef = $scope.gridConfig.columns[1];

    telephoneColumnDef.template = '<input ng-model="cell.value">';

    element = $compile(HTML_TEMPLATE)($scope);

    $scope.$digest();

    var rowsElm = $('tbody tr', element);

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      var telephoneInput = rowsElm.eq(i).find('td').eq(1).find('input');
      expect(telephoneInput.length).toBe(1);
      expect(telephoneInput.val()).toBe($scope.gridData[i]['telephone']);
      expect(telephoneInput.scope().cell.value).toBe(telephoneInput.val());

      var oldValue = $scope.gridData[i]['telephone'];

      telephoneInput.val(oldValue + ' updated');
      telephoneInput.trigger('change');

      // It should update cell.value
      expect(telephoneInput.scope().cell.value).toBe(oldValue + ' updated');

      // The original value should not be changed
      expect($scope.gridData[i]['telephone']).toBe(oldValue);
    }
  });

  it('should save using a cell save api', function() {
    var telephoneColumnDef = $scope.gridConfig.columns[1];

    telephoneColumnDef.template = '<input ng-model="cell.value" ng-blur="cell.save()">';

    element = $compile(HTML_TEMPLATE)($scope);
    $scope.$digest();

    var rowsElm = $('tbody tr', element);

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      var telephoneInput = rowsElm.eq(i).find('td').eq(1).find('input');
      expect(telephoneInput.length).toBe(1);
      expect(telephoneInput.val()).toBe($scope.gridData[i]['telephone']);

      var oldValue = $scope.gridData[i]['telephone'];

      telephoneInput.val(oldValue + ' updated');
      telephoneInput.trigger('change');

      expect($scope.gridData[i]['telephone']).toBe(oldValue);

      telephoneInput.trigger('blur');

      expect($scope.gridData[i]['telephone']).toBe(oldValue + ' updated');
    }
  });

  it('should save using a row save api', function() {
    var telephoneColumnDef = $scope.gridConfig.columns[1];

    telephoneColumnDef.template = '<input ng-model="cell.value" ng-focus="cell.isEditPending=true" ng-blur="cell.getRow().save()">';

    element = $compile(HTML_TEMPLATE)($scope);

    $scope.$digest();

    var rowsElm = $('tbody tr', element);

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      var telephoneInput = rowsElm.eq(i).find('td').eq(1).find('input');
      expect(telephoneInput.length).toBe(1);
      expect(telephoneInput.val()).toBe($scope.gridData[i]['telephone']);

      var oldValue = $scope.gridData[i]['telephone'];

      telephoneInput.val(oldValue + ' updated');
      telephoneInput.trigger('change');
      telephoneInput.trigger('focus');

      expect($scope.gridData[i]['telephone']).toBe(oldValue);

      telephoneInput.trigger('blur');

      expect($scope.gridData[i]['telephone']).toBe(oldValue + ' updated');
    }
  });

  it('should not save a row if none of the cells are in ' +
      'pending edit mode', function() {
    var telephoneColumnDef = $scope.gridConfig.columns[1];

    telephoneColumnDef.template = '<input ng-model="cell.value" ' +
        'ng-focus="cell.isEditPending=false" ng-blur="cell.getRow().save()">';

    element = $compile(HTML_TEMPLATE)($scope);

    $scope.$digest();

    var rowsElm = $('tbody tr', element);

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      var telephoneInput = rowsElm.eq(i).find('td').eq(1).find('input');
      expect(telephoneInput.length).toBe(1);
      expect(telephoneInput.val()).toBe($scope.gridData[i]['telephone']);

      var oldValue = $scope.gridData[i]['telephone'];

      telephoneInput.val(oldValue + ' updated');
      telephoneInput.trigger('change');
      telephoneInput.trigger('focus');

      expect($scope.gridData[i]['telephone']).toBe(oldValue);

      telephoneInput.trigger('blur');

      expect($scope.gridData[i]['telephone']).toBe(oldValue);
    }
  });

  it('should save using the grid api save', function() {
    $scope.gridApi;

    var telephoneColumnDef = $scope.gridConfig.columns[1];

    telephoneColumnDef.template = '<input ng-model="cell.value" ' +
        'ng-change="cell.isEditPending=true;cell.getRow().isEditPending=true">';

    element = $compile('<mcc-grid data-grid-data="gridData" ' +
        'data-grid-api="gridApi" data-config="gridConfig"></mcc-grid>')($scope);

    $scope.$digest();

    var rowsElm = $('tbody tr', element);

    var updatedValuesList = [];

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      var telephoneInput = rowsElm.eq(i).find('td').eq(1).find('input');
      expect(telephoneInput.length).toBe(1);
      expect(telephoneInput.val()).toBe($scope.gridData[i]['telephone']);

      var oldValue = $scope.gridData[i]['telephone'];

      telephoneInput.val(oldValue + ' updated');
      telephoneInput.trigger('change');

      expect($scope.gridData[i]['telephone']).toBe(oldValue);

      updatedValuesList[i] = oldValue + ' updated';
    }

    // Call save from grid api
    $scope.gridApi.save();

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      expect($scope.gridData[i]['telephone']).toBe(updatedValuesList[i]);
    }
  });

  it('should not save using the grid api save if the row' +
      ' is not in pending edit mode', function() {
    $scope.gridApi;

    var telephoneColumnDef = $scope.gridConfig.columns[1];

    telephoneColumnDef.template = '<input ng-model="cell.value" ' +
        'ng-change="cell.isEditPending=true;cell.getRow().isEditPending=false">';

    element = $compile('<mcc-grid data-grid-data="gridData" ' +
        'data-grid-api="gridApi" data-config="gridConfig"></mcc-grid>')($scope);

    $scope.$digest();

    var rowsElm = $('tbody tr', element);

    var oldValuesList = [];

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      var telephoneInput = rowsElm.eq(i).find('td').eq(1).find('input');
      expect(telephoneInput.length).toBe(1);
      expect(telephoneInput.val()).toBe($scope.gridData[i]['telephone']);

      var oldValue = $scope.gridData[i]['telephone'];

      telephoneInput.val(oldValue + ' updated');
      telephoneInput.trigger('change');

      expect($scope.gridData[i]['telephone']).toBe(oldValue);

      oldValuesList[i] = oldValue;
    }

    // Call save from grid api
    $scope.gridApi.save();

    for (var i= 0, length=rowsElm.length; i<length; i++) {
      expect($scope.gridData[i]['telephone']).toBe(oldValuesList[i]);
    }
  });
});