'use strict';

describe('Grid layout', function() {
  var $compile;
  var $scope;
  var MccDialog;
  var MOCK_CONFIG;

  beforeEach(module('mcc.factory.dialog'));

  // load test dependencies
  // ** The injector unwraps the underscores (_) from around the parameter names when matching
  beforeEach(inject(function(_$compile_, _$rootScope_, mccDialog){
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
    MccDialog = mccDialog;
  }));

  describe('Mcc dialog tests', function(){
    beforeEach(function(){
      MOCK_CONFIG = {
        title: 'Test title',
        showBackdrop: false,
        template: 'Template is compiled to app scope<br>' +
        '<input type="text" ng-model="testValue">',
        buttons: [
          {
            title: 'Cancel',
            classes: ['btn-cancel1', 'btn-cancel2']
          },
          {
            title: 'Ok',
            classes: ['btn-success']
          }
        ]
      };
    });

    afterEach(function() {
     $('body').empty();
    });

    describe('Basic compiliation and rendering', function() {
      it('should render a modal', function() {
        expect($('.modal-backdrop').length).toBe(0);
        expect($('.mcc-modal').length).toBe(0);
        expect($('.mcc-modal .modal-dialog').length).toBe(0);
        expect($('.mcc-modal .modal-header').length).toBe(0);
        expect($('.mcc-modal .modal-body').length).toBe(0);
        expect($('.mcc-modal .modal-footer').length).toBe(0);

        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        expect($('.modal-backdrop').length).toBe(0);
        expect($('.mcc-modal').length).toBe(1);
        expect($('.mcc-modal .modal-dialog').length).toBe(1);
        expect($('.mcc-modal .modal-header').length).toBe(1);
        expect($('.mcc-modal .modal-body').length).toBe(1);
        expect($('.mcc-modal .modal-footer').length).toBe(1);
      });

      it('should be hidden default', function() {
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        expect($('.mcc-modal').hasClass('in')).toBe(false);
      });

      it('should render a modal backdrop if specified', function() {
        expect($('.modal-backdrop').length).toBe(0);
        expect($('.mcc-modal').length).toBe(0);

        MOCK_CONFIG.showBackdrop = true;
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        expect($('.modal-backdrop').length).toBe(1);
        expect($('.mcc-modal').length).toBe(1);
      });

      it('should render a modal header', function() {
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        expect($('.mcc-modal .modal-header').length).toBe(1);
        expect($('.mcc-modal .modal-header').text())
            .toContain('Test title');
      });

      it('should not render a header if no title is specified',
          function() {
        MOCK_CONFIG.title = undefined;
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();
        expect($('.mcc-modal .modal-header').length).toBe(0);
      });

      it('should render a body', function() {
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        expect($('.mcc-modal .modal-body').length).toBe(1);
        expect($('.mcc-modal .modal-body').text())
            .toContain('Template is compiled to app scope');
      });

      it('should render a footer if buttons are specified', function() {
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        var footer = $('.mcc-modal .modal-footer'),
            buttons = $('button', footer);

        expect(footer.length).toBe(1);
        expect(buttons.length).toBe(2);

        expect(buttons.eq(0).text()).toBe('Cancel');
        expect(buttons.eq(0).hasClass('btn-cancel1')).toBe(true);
        expect(buttons.eq(0).hasClass('btn-cancel2')).toBe(true);

        expect(buttons.eq(1).text()).toBe('Ok');
        expect(buttons.eq(1).hasClass('btn-success')).toBe(true);
      });

      it('should not render a footer if no buttons are specified',
          function() {
        MOCK_CONFIG.buttons = [];
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        expect($('.mcc-modal .modal-footer').length).toBe(0);
      });
    });

    describe('Interactions with modal', function() {
      it('should open a modal', function() {
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        expect($('.mcc-modal').hasClass('in')).toBe(false);

        $scope.testDialog.show();
        $scope.$apply();

        expect($('.mcc-modal').hasClass('in')).toBe(true);
      });

      it('should close a modal', function() {
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        $scope.testDialog.show();
        $scope.$apply();
        expect($('.mcc-modal').hasClass('in')).toBe(true);


        $scope.testDialog.hide();
        $scope.$apply();
        expect($('.mcc-modal').hasClass('in')).toBe(false);
      });

      it('should add a default click handler to footer buttons',
          function() {
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        $scope.testDialog.show();
        $scope.$apply();
        expect($('.mcc-modal').hasClass('in')).toBe(true);

        var cancelBtn = $('.mcc-modal .modal-footer button').eq(0);
        cancelBtn.click();
        expect($('.mcc-modal').hasClass('in')).toBe(false);
      });

      it('should use a custom click handler for footer buttons if specified',
          function() {
        // For spying purposes.
        $scope.testHandler = function() {};
        spyOn($scope, 'testHandler');

        // Set up a custom clickhandler for Ok button.
        MOCK_CONFIG.buttons[1].clickHandler = function() {
          $scope.testHandler();
          $scope.testDialog.hide();
        };

        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        $scope.testDialog.show();
        $scope.$apply();

        var okBtn = $('.mcc-modal .modal-footer button').eq(1);

        okBtn.click();

        expect($('.mcc-modal').hasClass('in')).toBe(false);
        expect($scope.testHandler).toHaveBeenCalled();
      });

      it('should compile the body template to the app scope',
          function() {
        $scope.testValue = 'abc';

        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        var inputElm = $('.mcc-modal .modal-body input');
        inputElm.val('123');
        inputElm.trigger('change');

        $scope.$apply();

        expect($scope.testValue).toEqual('123');
      });

      it('should close a modal when press ESC', function() {
        $scope.testDialog = new MccDialog(MOCK_CONFIG, $scope);
        $scope.$apply();

        $scope.testDialog.show();
        $scope.$apply();
        expect($('.mcc-modal').hasClass('in')).toBe(true);

        var testEvent = $.Event('keyup', { which: 27 });
        $('body').trigger(testEvent);

        expect($('.mcc-modal').hasClass('in')).toBe(false);
      });
    })
  });
});