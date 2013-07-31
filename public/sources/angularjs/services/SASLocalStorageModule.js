/* Start angularLocalStorage */

var angularLocalStorage = angular.module('sasLocalStorageModule', []);

// You should set a prefix to avoid overwriting any local storage variables from the rest of your app
// e.g. angularLocalStorage.constant('prefix', 'youAppName');
angularLocalStorage.constant('prefix', 'smartadserver_');
angularLocalStorage.constant('notify', { setItem: true, removeItem: false });

angularLocalStorage.service('localStorageService', [
  '$rootScope',
  'prefix',
  'notify',
  function ($rootScope, prefix, notify) {


      // If there is a prefix set in the config lets use that with an appended period for readability
      //var prefix = angularLocalStorage.constant;
      if (prefix.substr(-1) !== '.') {
          prefix = !!prefix ? prefix + '.' : '';
      }

      // Checks the browser to see if local storage is supported
      var browserSupportsLocalStorage = function () {
          try {
              if (Modernizr) {
                  return Modernizr.localStorage;
              } else {
                  return ('localStorage' in window && window['localStorage'] !== null);
              }
          } catch (e) {
              $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
              return false;
          }
      };

      // Directly adds a value to local storage
      // Example use: localStorageService.add('library','angular');
      // If the value is not a string, we serialize it because storing it
      var addToLocalStorage = function (key, value) {

          // check if this browser support local storage
          if (!browserSupportsLocalStorage()) {
              $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
              return false;
          }

          // 0 and "" is allowed as a value but let's limit other falsey values like "undefined"
          if (!value && value !== 0 && value !== "") return false;

          try {
              localStorage.setItem(prefix + key, JSON.stringify(value));
              if (notify.setItem) {
                  $rootScope.$broadcast('LocalStorageModule.notification.setitem', { key: key, newvalue: value, storageType: 'localStorage' });
              }
          } catch (e) {
              $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
              return false;
          }
          return true;
      };

      // Retrieve a value from local storage
      // Example use: localStorageService.get('library'); // returns 'angular'
      // Params:
      // key : key in the localstorage
      // OutputType (optional) : You can specify an output type to directly retrieve the value with the right type and not as a string
      // callbacks   (optional) : Functions to be called if a value has been found for the key or not
      var getFromLocalStorage = function (key, outputType, callbackSuccess, callbackError) {

          // if outputType is a function and call is undefined, it means that outputType is the callback function
          // It is possible because the last two params are optional
          if (outputType && {}.toString.call(outputType) === '[object Function]') {

              // We shift the params and give default value to the output type
              callbackSuccess = outputType;
              callbackError = callbackSuccess;
              outputType = "string";
          }
          // Default return type
          if(outputType == undefined) {
              outputType = "string";
          }

          if (!browserSupportsLocalStorage()) {
              $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
              return callbackError != undefined ? callbackError() : null;
          }
          // Get the item
          var item = localStorage.getItem(prefix + key);
          if (!item)
              return callbackError != undefined ? callbackError() : null;

          // Parse the item
          switch (outputType.toLowerCase()) {
              case "integer" || "int":
                  item = parseInt(item);
                  break;
              case "float":
                  item = parseFloat(item);
                  break;
              case "boolean" || "bool":
                  item = item.toLowerCase() == "true";
                  break;
              case "json" || "object":
                  item = parseJson(item);
                  break;
              case "string":
                  // Do nothing
                  break;

          }
          return callbackSuccess(item);
      };

      // Remove an item from local storage
      // Example use: localStorageService.remove('library'); // removes the key/value pair of library='angular'
      var removeFromLocalStorage = function (key) {
          if (!browserSupportsLocalStorage()) {
              $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
              return false;
          }

          try {
              localStorage.removeItem(prefix + key);
              if (notify.removeItem) {
                  $rootScope.$broadcast('LocalStorageModule.notification.removeitem', { key: key, storageType: 'localStorage' });
              }
          } catch (e) {
              $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
              return false;
          }
          return true;
      };

      // Remove all data for this app from local storage
      // Example use: localStorageService.clearAll();
      // Should be used mostly for development purposes
      var clearAllFromLocalStorage = function () {

          if (!browserSupportsLocalStorage()) {
              $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
              return false;
          }

          var prefixLength = prefix.length;

          for (var key in localStorage) {
              // Only remove items that are for this app
              if (key.substr(0, prefixLength) === prefix) {
                  try {
                      removeFromLocalStorage(key.substr(prefixLength));
                  } catch (e) {
                      $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                      return false;
                  }
              }
          }
          return true;
      };

      var parseJson = function (sJSON) {
          return JSON && JSON.parse(json) || $.parseJSON(json);
      };

      return {
          isSupported: browserSupportsLocalStorage,
          add: addToLocalStorage,
          get: getFromLocalStorage,
          remove: removeFromLocalStorage,
          clearAll: clearAllFromLocalStorage
      };

  }]);
