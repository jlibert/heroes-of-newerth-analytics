/* jslint node: true */
'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/dashboard', {
      templateUrl: 'partials/dashboard',
      controller: 'dashboardCtrl'
    }).
    otherwise({
      redirectTo: '/dashboard'
    });

  $locationProvider.html5Mode(true);
});
