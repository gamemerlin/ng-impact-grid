MCC Grid
=================

A high performance customizable grid for your angular application.

## Getting Started

To get you started you can simply clone the mcc-grid repository and install the dependencies:

We also use a number of node.js tools to initialize and test angular-seed. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone mcc-grid

Clone the angular-seed repository using [git][git]:

```
git clone https://github.com/gamemerlin/ng-impact-grid.git
cd ng-impact-grid
```
### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
angular-seed changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/examples/index.html`.

## Mcc Grid example usage

To use render and mcc grid component, set up a grid configuration and pass in a list of data items:
```
    <mcc-grid
        data-config="gridConfig"
        data-grid-data="gridData"></mcc-grid>
```
It is assumed that your data is a list of JSON objects. The following section explains the grid configuration options.

## Mcc Grid Configuration API

####Mcc Grid Top Level properties

To configure your grid, in your applications controller define a bindable grid configuration object on scope or controller as follows:
```
    $scope.AppCtrl.gridConfig = {
      columns: [..],
      headers: {...},
      rows: {...},
      table: {...}
    }
```

Cofig Id           | Type | Description
---------------------|----------------|-------------------|
columns | Array.&lt;<a href="#col-definition">Column Definition</a>&gt;|A list of column definition configurations.|
header|Object|The configuration for the header.|
rows|Object|The row configurations for this grid.|
table|Object|Options for the grid behavior.|

