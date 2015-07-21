// An empty module for directives.
angular.module('mcc.components', [
  'mcc.directives.grid',
  'mcc.factory.dialog'
]);

// grid module
angular.module('mcc.directives.grid', ['mcc.directives.templates']);

// dialog module
angular.module("mcc.factory.dialog", []);