(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid-body.html',
    '<div class="mcc-grid-body-container" ng-style="{\'height\': BodyCtrl.getHeight()}" ng-class="{\'can-scroll-x\': BodyCtrl.canScrollX(), \'can-scroll-y\': BodyCtrl.canScrollY()}">\n' +
    '  <table>\n' +
    '    <tbody>\n' +
    '      <tr ng-repeat="row in GridCtrl.getViewPortRows()">\n' +
    '        <td class="mcc-grid-td" ng-repeat="cell in row.getCells()"></td>\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '  </table>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid-header.html',
    '<!-- there is a bug in this version of angular that makes\n' +
    '     impossible to use TABLE, TH, TR, TD as directive elements\n' +
    '     to be replace in templates :( -->\n' +
    '<thead>\n' +
    '  <tr>\n' +
    '      <th ng-repeat="column in HeaderCtrl.firstHeaderRow"\n' +
    '          class="mcc-grid-th"\n' +
    '          data-column="column">\n' +
    '        {{ column.title }}\n' +
    '      </th>\n' +
    '  </tr>\n' +
    '  <tr ng-if="HeaderCtrl.hasGroupedColumns">\n' +
    '     <th class="mcc-grid-th"\n' +
    '         ng-repeat="column in HeaderCtrl.secondHeaderRow"\n' +
    '         data-column="column">{{ column.title }}</th>\n' +
    '  </tr>\n' +
    '</thead>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid-pagination.html',
    '<div class="mcc-grid-pagination">\n' +
    '  <div class="clearfix">\n' +
    '    <div class="total-results">\n' +
    '      <b class="ng-binding">{{ PaginationCtrl.getTotalCount() }}</b><span class="ng-binding"> Total Result(s)</span>\n' +
    '    </div>\n' +
    '    <div class="per-page">\n' +
    '      <span class="ng-binding">Per page</span>\n' +
    '      <ul>\n' +
    '        <li ng-repeat="pageLength in PaginationCtrl.getPerPageSizes()">\n' +
    '          <a href="" ng-class="{selected: PaginationCtrl.isPageSelected(pageLength)}" ng-click="PaginationCtrl.setPageSize(pageLength)">{{ pageLength }}</a>\n' +
    '        </li>\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '    <ul class="controls">\n' +
    '      <li>\n' +
    '        <button class="first fa fa-angle-double-left"\n' +
    '            ng-click="PaginationCtrl.gotoFirstPage()"\n' +
    '            ng-disabled="!PaginationCtrl.isFirstPageEnabled()"></button>\n' +
    '      </li>\n' +
    '      <li>\n' +
    '        <button class="previous fa fa-angle-left"\n' +
    '            ng-click="PaginationCtrl.gotoPrevPage()"\n' +
    '            ng-disabled="!PaginationCtrl.isPrevPageEnabled()"> </button>\n' +
    '      </li>\n' +
    '      <li class="counter">\n' +
    '        <form ng-submit="inputPage()">\n' +
    '          <input ng-model="PaginationCtrl.getState().page"> <span class="ng-binding">of</span> <span class="total-pages" ng-bind="PaginationCtrl.getTotalPages()"></span>\n' +
    '        </form>\n' +
    '      </li>\n' +
    '      <li>\n' +
    '        <button class="next fa fa-angle-right" ng-click="PaginationCtrl.gotoNextPage()"\n' +
    '            ng-disabled="!PaginationCtrl.isNextPageEnabled()"> </button>\n' +
    '      </li>\n' +
    '      <li>\n' +
    '        <button class="last fa fa-angle-double-right"\n' +
    '            ng-click="PaginationCtrl.gotoLastPage()"\n' +
    '            ng-disabled="!PaginationCtrl.isLastPageEnabled()"></button>\n' +
    '      </li>\n' +
    '    </ul>\n' +
    '</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid.html',
    '<div class="mcc-grid-container">\n' +
    '    <table class="mcc-grid-header"\n' +
    '           data-column-defs="GridCtrl.getConfig().columns"\n' +
    '           data-is-sticky="HeaderCtrl.isSticky()"></table>\n' +
    '    <div mcc-grid-body></div>\n' +
    '    <div mcc-grid-footer ng-if="GridCtrl.getConfig().pagination"></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid/mcc-grid-body.html',
    '<div class="mcc-grid-body-container" ng-style="{\'height\': BodyCtrl.getHeight()}" ng-class="{\'can-scroll-x\': BodyCtrl.canScrollX(), \'can-scroll-y\': BodyCtrl.canScrollY()}">\n' +
    '  <table>\n' +
    '    <tbody>\n' +
    '      <tr ng-repeat="row in GridCtrl.getViewPortRows()">\n' +
    '        <td class="mcc-grid-td" ng-repeat="cell in row.getCells()"></td>\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '  </table>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid/mcc-grid-header.html',
    '<!-- there is a bug in this version of angular that makes\n' +
    '     impossible to use TABLE, TH, TR, TD as directive elements\n' +
    '     to be replace in templates :( -->\n' +
    '<thead>\n' +
    '  <tr>\n' +
    '      <th ng-repeat="column in HeaderCtrl.firstHeaderRow"\n' +
    '          class="mcc-grid-th"\n' +
    '          data-column="column">\n' +
    '        {{ column.title }}\n' +
    '      </th>\n' +
    '  </tr>\n' +
    '  <tr ng-if="HeaderCtrl.hasGroupedColumns">\n' +
    '     <th class="mcc-grid-th"\n' +
    '         ng-repeat="column in HeaderCtrl.secondHeaderRow"\n' +
    '         data-column="column">{{ column.title }}</th>\n' +
    '  </tr>\n' +
    '</thead>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid/mcc-grid-pagination.html',
    '<div class="mcc-grid-pagination">\n' +
    '  <div class="clearfix">\n' +
    '    <div class="total-results">\n' +
    '      <b class="ng-binding">{{ PaginationCtrl.getTotalCount() }}</b><span class="ng-binding"> Total Result(s)</span>\n' +
    '    </div>\n' +
    '    <div class="per-page">\n' +
    '      <span class="ng-binding">Per page</span>\n' +
    '      <ul>\n' +
    '        <li ng-repeat="pageLength in PaginationCtrl.getPerPageSizes()">\n' +
    '          <a href="" ng-class="{selected: PaginationCtrl.isPageSelected(pageLength)}" ng-click="PaginationCtrl.setPageSize(pageLength)">{{ pageLength }}</a>\n' +
    '        </li>\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '    <ul class="controls">\n' +
    '      <li>\n' +
    '        <button class="first fa fa-angle-double-left"\n' +
    '            ng-click="PaginationCtrl.gotoFirstPage()"\n' +
    '            ng-disabled="!PaginationCtrl.isFirstPageEnabled()"></button>\n' +
    '      </li>\n' +
    '      <li>\n' +
    '        <button class="previous fa fa-angle-left"\n' +
    '            ng-click="PaginationCtrl.gotoPrevPage()"\n' +
    '            ng-disabled="!PaginationCtrl.isPrevPageEnabled()"> </button>\n' +
    '      </li>\n' +
    '      <li class="counter">\n' +
    '        <form ng-submit="inputPage()">\n' +
    '          <input ng-model="PaginationCtrl.getState().page"> <span class="ng-binding">of</span> <span class="total-pages" ng-bind="PaginationCtrl.getTotalPages()"></span>\n' +
    '        </form>\n' +
    '      </li>\n' +
    '      <li>\n' +
    '        <button class="next fa fa-angle-right" ng-click="PaginationCtrl.gotoNextPage()"\n' +
    '            ng-disabled="!PaginationCtrl.isNextPageEnabled()"> </button>\n' +
    '      </li>\n' +
    '      <li>\n' +
    '        <button class="last fa fa-angle-double-right"\n' +
    '            ng-click="PaginationCtrl.gotoLastPage()"\n' +
    '            ng-disabled="!PaginationCtrl.isLastPageEnabled()"></button>\n' +
    '      </li>\n' +
    '    </ul>\n' +
    '</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('mcc.directives.templates');
} catch (e) {
  module = angular.module('mcc.directives.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/mcc-grid/mcc-grid.html',
    '<div class="mcc-grid-container">\n' +
    '    <table class="mcc-grid-header"\n' +
    '           data-column-defs="GridCtrl.getConfig().columns"\n' +
    '           data-is-sticky="HeaderCtrl.isSticky()"></table>\n' +
    '    <div mcc-grid-body></div>\n' +
    '    <div mcc-grid-footer ng-if="GridCtrl.getConfig().pagination"></div>\n' +
    '</div>');
}]);
})();
