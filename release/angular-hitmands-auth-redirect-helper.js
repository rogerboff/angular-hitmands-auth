(function(window, angular) {
   'use strict';

   /* @ngInject */
   function AuthRedirectHelper() {
      var state = null, params = null;
      this.useRoutes = function(newRoutes) {
         !angular.isArray(newRoutes) && angular.isObject(newRoutes) && angular.extend(routes, newRoutes);
      };
      this.$get = ['$state', 'AuthService', '$rootScope', '$location', function($state, AuthService, $rootScope, $location) {
         var _unsetRedirect = function() {
            state = null;
            params = null;
         }, _getRedirect = function() {
            return {
               "state": state,
               "params": params
            };
         };
         $rootScope.$on("$stateChangeSuccess", function(event, toState) {
            toState.name !== routes.login && _unsetRedirect();
         });
         return {
            "set": function(toState, toParams) {
               if (!angular.isArray(toState) && angular.isObject(toState)) {
                  angular.isUndefined(toParams) && (toParams = {});
                  state = toState;
                  params = toParams;
               }
            },
            "get": function() {
               return _getRedirect();
            },
            "isSetted": function() {
               return angular.isObject(_getRedirect().state);
            },
            "unset": function() {
               _unsetRedirect();
            },
            "go": function() {
               angular.isObject(state) && AuthService.authorize(state) && $state.go(state, params);
               _unsetRedirect();
            },
            "otherwise": function() {
               return $state.go(routes.otherwise);
            },
            "goHome": function() {
               return $location.path("/");
            }
         };
      }];
   }

   /* @ngInject */
   function moduleRun() {}

   var routes = {
      "otherwise": "login"
   };

   angular.module("hitmands.auth").provider("AuthRedirectHelper", AuthRedirectHelper).run(moduleRun);
//# sourceMappingURL=angular-hitmands-auth-redirect-helper.js.map

})(window, angular);