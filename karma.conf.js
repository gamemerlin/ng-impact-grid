module.exports = function(config){
  config.set({

    basePath : '',

    preprocessors: {
      'src/**/*.html': ['html2js']
    },

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/jquery/jquery.js',
      'src/**/*.js',
      'src/**/*.html',
      'tests/**/*.js'
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

    ngHtml2JsPreprocessor: {
      prependPrefix: '../'
    },

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
