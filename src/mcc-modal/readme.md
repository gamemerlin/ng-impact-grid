## Mcc Modal example usage

The mcc modal component is a factory service that returns a Constructor function for modal creation. To use this component, inject the service into your angular app controller. Once it is injected call "new" on it and set as an instance variable that is accessible on your $scope.

```
    .controller('View2Ctrl', ['$scope', 'mccDialog', function($scope, MccDialog) {
      $scope.dialog1 = new MccDialog({
        domId: 'testId',
        title: 'Title for this dialog',
        showBackdrop: true,
        template: 'Template is compiled to app scope<br>' +
        '<input type="text" ng-model="testValue">',
        buttons: [
          {
            title: 'Cancel'
          },
          {
            title: 'Ok',
            classes: ['btn-success'],
            clickHandler: function() {
              console.log('clicking on success')
              $scope.dialog1.hide();
            }
          }
        ]}, $scope);
}]);
```
## Mcc Modal Configuration API

####MccModal factory constructor arguments

The constructor takes as its arguments 1) the modal config and 2) the application target scope. If no target scope is provided an isolated scope will be created in the background:

<style type="text/css">
  td {
    vertical-align: top;
  }
</style>

<table>
  <thead>
    <tr>
      <th width="100">Argument</th>
      <th>Required?</th>
      <th width="200">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>config</td>
      <td>Yes</td>
      <td><a href="#config-definition">Object</a></td>
      <td>The modal configuration object.</td>
    </tr>
    <tr>
      <td>target scope</td>
      <td>No</td>
      <td>Object</td>
      <td>The scope to link the template or templateUrl to. If none is provided an isloated scope will be created to link to the body template provided.</td>
    </tr>
  </tbody>
</table>

####MccModal Public API
<table>
  <thead>
    <tr>
      <th width="100">Method</th>
      <th width="200">Arguments</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>createDialogContent</td>
      <td>[targetScope (optional)]</td>
      <td>Relinks the modal content template to the provided targetScope. If a targetScope is not provided the content will be linked to the modals isolates scope.</td>
    </tr>
    <tr>
      <td>getDomId</td>
      <td></td>
      <td>Gets the dom id from the config.</td>
    </tr>
    <tr>
      <td>getTitle</td>
      <td></td>
      <td>Gets the header title text.</td>
    </tr>
    <tr>
      <td>show</td>
      <td></td>
      <td>Shows the modal.</td>
    </tr>
    <tr>
      <td>hide</td>
      <td></td>
      <td>hides the modal.</td>
    </tr>
  </tbody>
</table>

####Mcc Grid Column definition <a name="config-definition"></a>
Example usage:
```
      $scope.something = new MccDialog({
        domId: 'somethingsDomId',
        title: 'Something Title',
        showBackdrop: true,
        template: 'Template is compiled to app scope for Something<br>' +
        '<input type="text" ng-model="testValue">',
        buttons: [
          {
            title: 'Cancel'
          },
          {
            title: 'Ok',
            classes: ['btn-success'],
            clickHandler: function() {
              console.log('clicking on success')
              $scope.something.hide();
            }
          }
        ]}, $scope);
```

<table>
  <thead>
    <tr>
      <th width="100">Config Id</th>
      <th>Required?</th>
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>domId</td>
      <td>No</td>
      <td>String</td>
      <td>Will add an id="domId" if provided. Useful if you need to capture your modal in end to end tests.</td>
    </tr>
    <tr>
      <td>showBackdrop</td>
      <td>No</td>
      <td>Boolean</td>
      <td>Whether to show a backdrop when this modal is shown.</td>
    </tr>
    <tr>
      <td>template</td>
      <td>Yes</td>
      <td>String</td>
      <td>The template for the modal's content.</td>
    </tr>
    <tr>
      <td>title</td>
      <td>No</td>
      <td>String</td>
      <td>Title for this modal. If none is provide the header will not be shown.</td>
    </tr>
    <tr>
      <td>buttons</td>
      <td>No</td>
      <td>Array.&lt;<a href="#button-config-defs">Object</a>&gt;</td>
      <td>A list of button configurations. If none is provided the footer of the modal will not be shown.</td>
    </tr>
  </tbody>
</table>

####Mcc Grid header configuration options <a name="button-config-defs"></a>
<table>
  <thead>
    <tr>
      <th width="100">Config Id</th>
      <th>Required?</th>
      <th width="100">Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Title</td>
      <td>Yes</td>
      <td>String</td>
      <td>
          The label for this button.
      </td>
    </tr>
    <tr>
      <td>classes</td>
      <td>No</td>
      <td>Array.&lt;String&gt;</td>
      <td>
          A list of button classes for this button.
      </td>
    </tr>
    <tr>
      <td>classes</td>
      <td>No</td>
      <td>Function</td>
      <td>
          A custom handler to execute on click. If none is provided a default handler to close the modal will be provided.
      </td>
    </tr>
  </tbody>
</table>
