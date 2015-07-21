module.exports = function(config){
  config.set({

    basePath : '',

    files : [
      'bower_components/jquery/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/modules.js',
      'src/templates.js',
      'src/mcc-grid/**/*.js',
      'src/mcc-modal/**/*.js',
      //'dist/mcc-components.js',
      'tests/mocks/**/*.js',
      'tests/components/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-ng-html2js-preprocessor',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
