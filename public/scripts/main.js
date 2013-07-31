var Application = angular.module('ManageDoc', []);

Application.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  	  when('/', {templateUrl: 'views/ManageDoc.html',   controller: 'ManageDocCtrl'}).
      when('/ManageDoc', {templateUrl: 'views/ManageDoc.html',   controller: 'ManageDocCtrl'}).
      when('/ComponentsLibrary', {templateUrl: 'views/ComponentsLibrary/ComponentsLibrary.html',   controller: 'ComponentsLibraryCtrl'}).
      when('/ComponentsLibrary/:componentId', {templateUrl: 'views/ComponentsLibrary/ComponentDetails.html',   controller: 'ComponentDetailsCtrl'}).
      when('/Graphics', {templateUrl: 'views/Graphics.html',   controller: 'GraphicsCtrl'}).
      otherwise({redirectTo: '/'});
}]);

function mainController($scope) {


}

mainController.$inject = ['$scope'];

Application.controller('ManageDocCtrl', ['$scope', function($scope) {

}]);


Application.controller('GraphicsCtrl', ['$scope', function($scope) {

}]);