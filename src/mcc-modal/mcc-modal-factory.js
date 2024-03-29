var dialogModule = angular.module('mcc.factory.dialog');

/**
 * A singleton service to create and manage the life
 * cycle of a modal dialog's backdrop. Meant to be shared
 * across multiple instances of dialog components.
 * @param $rootScope
 * @param $document
 * @param $compile
 * @constructor
 */
BackdropService.$inject = ['$rootScope', '$document', '$compile'];

function BackdropService($rootScope, $document, $compile) {
  this.compile_ = $compile;
  this.document_ = $document;

  this.isVisible_ = false;
  this.isCreated_ = false;

  // Create an isolate scope for this backdrop to bind
  // to and set this service as the controller.
  var backdropScope = $rootScope.$new(true);
  backdropScope.ctrl = this;
  this.scope_ = backdropScope;
}

/**
 * Compile the backdrop template to an isolate scope and
 * append it to the BODY element.
 * @private
 */
BackdropService.prototype.createBackdrop = function() {
  var BACKDROP_HTML =
      '<div class="modal-backdrop" ng-class="{\'fade in\': ctrl.isVisible()}"></div>';

  var element = this.compile_(BACKDROP_HTML)(this.scope_);

  // Append the backdrop to the body.
  angular.element(this.document_).
      find('body').
      append(element);

  this.backdropElement_ = element;

  this.isCreated_ = true;
};

BackdropService.prototype.showBackdrop = function() {
  if (!this.isCreated_) {
    this.createBackdrop();
  }

  this.isVisible_ = true;
};

BackdropService.prototype.hideBackdrop = function() {
  this.isVisible_ = false;
};

BackdropService.prototype.isVisible = function() {
  return this.isVisible_;
};

BackdropService.prototype.destroy = function() {
  this.backdropElement_.remove();

  this.backdropElement_ = null;

  this.isCreated_ = false;
};

/**
 * @param $rootScope
 * @param $compile
 * @param $document
 * @param mccBackdropService
 * @returns {Function} A constructor for the dialog object.
 * @constructor
 */
DialogFactory.inject = ['$rootScope', '$compile', '$document', '$timeout', 'mccBackdropService'];

function DialogFactory($rootScope, $compile, $document, $timeout, mccBackdropService) {
  /**
   * Constructor for a dialog component. Injectables are provided
   * by the factory wrapper.
   *
   * @param config
   * @param appScope
   * @constructor
   */
  function DialogConstructor(config, appScope) {
    this.config_ = config;
    this.backdropService_ = mccBackdropService;

    var modalScope = $rootScope.$new(true);
    modalScope.modalCtrl = this;

    this.scope_ = modalScope;
    this.appScope_ = appScope || modalScope;

    this.isVisible_ = false;

    this.isDialogCreated_ = false;
    this.dialog_;
    this.dialogContent_;

    this.bindEscape_();
    this.createDialog_();

    if (config.buttons && config.buttons.length) {
      this.ensureDefaultClickHandler_();
    }

    // Clean up this modal if we leave this page or
    // if this scope somehow gets destroyed.
    this.scope_.$on('$destroy', angular.bind(this, function() {
      this.backdropService_.destroy();
      angular.element($document).find('body').
          off('keyup', this.handleEscPress_);

      this.dialog_.remove();
      this.dialog_ = null;
    }));
  }

  DialogConstructor.prototype.createDialog_ = function() {
    if (this.isDialogCreated_) {
      return;
    }

    if (this.config_.showBackdrop) {
      this.backdropService_.createBackdrop();
    }

    this.dialogConent_ = angular.element('<div class="modal-content"></div>');

    var dialogHtml = angular.
        element('<div class="mcc-modal modal fade" ' +
        'id="{{modalCtrl.getDomId()}}" ' +
        'ng-class="{\'in\': modalCtrl.isVisible()}" ' +
        'tabindex="-1" role="dialog" aria-hidden="false"></div>')
        .append(
        angular.element('<div class="modal-dialog"></div>')
            .append(this.dialogConent_));

    this.dialog_ = $compile(angular.element(dialogHtml))(this.scope_);

    this.createDialogContent();

    angular.element($document).find('body').append(this.dialog_);

    this.isDialogCreated_ = true;
  };

  /**
   * Can be used publicly for use cases where one wants to reuse
   * a modal in different contexts, for example in a grid app
   * where each cell click opens up it's own version of a modal
   *
   * @param targetScope - A specific scope to bind the body template to.
   */
    // TODO - support templateUrl in configs and wrap this in and $http.get
  DialogConstructor.prototype.createDialogContent = function(targetScope) {
    this.dialogConent_.empty();

    // Compile and append header.
    this.dialogConent_.append(this.compileHeader_());
    // Compile and append body.
    this.dialogConent_.append(this.compileBody_(targetScope));
    // Compile and append footer.
    this.dialogConent_.append(this.compileFooter_());
  };

  /**
   * @returns {Element} A header compiled and linked to the dialog scope.
   * @private
   */
  DialogConstructor.prototype.compileHeader_ = function() {
    var element = angular.element(
        '<div class="modal-header" ng-if="modalCtrl.getTitle()">' +
        ' <span class="modal-title" ng-bind="modalCtrl.getTitle()"></span></div>');

    return $compile(element)(this.scope_);
  };

  /**
   * @param targetScope - A specific scope context to bind this body
   *     content to.
   * @returns {Element} - A body compiled and link to the app scope.
   * @private
   */
  DialogConstructor.prototype.compileBody_ = function(targetScope) {
    var element = angular.element('<div class="modal-body">' +
        this.config_.template + '</div>');

    return $compile(element)(targetScope || this.appScope_);
  };

  /**
   * @returns {Element} - A footer compiled to the dialog scope.
   * @private
   */
  DialogConstructor.prototype.compileFooter_ = function() {
    var element = angular.element(
        '<div class="modal-footer" ng-if="modalCtrl.hasButtons()">' +
        ' <button type="button" class="btn" ' +
        '     ng-repeat="button in modalCtrl.getButtons()" ' +
        '     ng-click="button.clickHandler()" ' +
        '     ng-disabled="button.disabledHandler()" ' +
        '     ng-class="button.classes">{{ button.title }}</button>' +
        '</div>');

    return $compile(element)(this.scope_);
  };

  DialogConstructor.prototype.getDomId = function() {
    return this.config_.domId;
  };

  DialogConstructor.prototype.getTitle = function() {
    return this.config_.title;
  };

  DialogConstructor.prototype.getButtons = function() {
    return this.config_.buttons;
  };

  DialogConstructor.prototype.hasButtons = function() {
    return this.config_.buttons && this.config_.buttons.length;
  };

  DialogConstructor.prototype.show = function() {
    if (this.config_.showBackdrop) {
      this.backdropService_.showBackdrop();
    }

    this.isVisible_ = true;
  };

  DialogConstructor.prototype.hide = function() {
    if (this.config_.showBackdrop) {
      this.backdropService_.hideBackdrop();
    }

    this.isVisible_ = false;
  };

  DialogConstructor.prototype.isVisible = function() {
    return this.isVisible_;
  };

  DialogConstructor.prototype.handleEscPress_ = function(e) {
    if (e.which == 27) {
      this.hide();
      // Digest modal and backdrop scopes.
      this.scope_.$digest();
      this.backdropService_.scope_.$digest();
    }
  };

  DialogConstructor.prototype.bindEscape_ = function() {
    angular.element($document).find('body').
        on('keyup', angular.bind(this, this.handleEscPress_));
  };

  /**
   * Checks each button to make sure it has a default click handler.
   * The default click handler simply closes the modal.
   * @private
   */
  DialogConstructor.prototype.ensureDefaultClickHandler_ = function() {
    var defaultClickHandler = angular.bind(this, function() {
      this.hide();
    });

    for (var i= 0,length = this.config_.buttons.length; i<length; i++) {
      var button = this.config_.buttons[i];
      if (!button.clickHandler) {
        button.clickHandler = defaultClickHandler;
      }
    }
  };

  return DialogConstructor;
}

dialogModule
    .service('mccBackdropService', BackdropService)
    .factory('mccDialog', DialogFactory);
