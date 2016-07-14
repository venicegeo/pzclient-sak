/*
 Copyright 2016, RadiantBlue Technologies, Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('LoginController', ['$scope', '$location', '$cookies', "$http", "discover", "toaster", "Auth", "CONST", "$rootScope", LoginController]);

    function LoginController ($scope, $location, $cookies, $http, discover, toaster, Auth, CONST, $rootScope) {
        $cookies.putObject(CONST.auth, Auth);
        $scope.login = function() {
            var test = Auth.encode($scope.username, $scope.password);//"bWNtYWhvam06bmF0UmVqOTNiM3N0MHch";//
            $http({
                method: "GET",
                url: "/proxy?url=" + discover.gatewayHost + "/key",
                headers: {
                    "Authorization": "Basic " + test
                }
            }).then(function successCallback( html ) {
                if (html.data.type === "uuid") {
                    Auth[CONST.isLoggedIn] = CONST.loggedIn;
                    Auth.encode(html.data.uuid, "");
                    Auth["userStore"] = $scope.user;
                    $cookies.putObject(CONST.auth, Auth);
                    $location.path("/index.html");
                    $rootScope.$emit('loggedInEvent');
                    toaster.pop('success', "Success", "You have logged in successfully.");
                } else {
                    Auth[CONST.isLoggedIn] = "aiefjkd39dkal3ladfljfk2kKA3kd";
                    Auth.encode("null", "null");
                    Auth["userStore"] = "";
                    $cookies.putObject(CONST.auth, Auth);
                    $location.path("/login.html");
                    console.log("login.controller fail: "+html.status);
                    toaster.pop('warning', "Invalid Credentials", "You have entered the wrong username or password.");
                }
            }, function errorCallback(response){
                console.log("login.controller fail: "+response.status);
                toaster.pop('error', "Error", "There was an issue with authentication.");
            });

        };
    }

})();