var Application = angular.module('SmartInternalDoc', ['ngResource']);

Application.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  	  when('/', {templateUrl: 'views/ManageDoc.html',   controller: ManageDocCtrl}).
      when('/ManageDoc', {templateUrl: 'views/ManageDoc.html',   controller: 'ManageDocCtrl'}).
      when('/ComponentsLibrary', {templateUrl: 'views/ComponentsLibrary/ComponentsLibrary.html',   controller: 'ComponentsLibraryCtrl'}).
      when('/Graphics', {templateUrl: 'views/Graphics.html',   controller: 'GraphicsCtrl'}).
      otherwise({redirectTo: '/'});
}]);

function mainController($scope) {


}

mainController.$inject = ['$scope'];

function GraphicsCtrl($scope) {

}

