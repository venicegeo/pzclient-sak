/**
 * Created by jduncan on 2/1/2016.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('NameServerController', ['$scope', '$http', '$log', '$q', 'toaster',  NameServerController]);

    function NameServerController ($scope, $http, $log, $q, toaster) {

        $scope.getServices = function (){
            $scope.getLogger();
            $scope.getUUID();
            $scope.getAlerter();
            $scope.getKafka();
            $scope.getZookeeper();
            $scope.getSearch();
            $scope.getIngest();
        };

        $scope.getLogger = function () {
            $scope.loggerService = "";
            $scope.errorMsg = "";
            var url = 'http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-logger';
            var request = $http({
                method: "GET",
                url: url

            });
            request.success(
                function( html ) {
                    $scope.loggerHost = html.host;
                    $scope.loggerType = html.type;
                    $scope.loggerPort = html.port;
                    console.log("success"+html.host);

                }
            )
            request.error(function(){
                console.log("name-server.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request. Logger service not found.");
            });
        };
        $scope.getUUID = function () {
            $scope.errorMsg = "";
            var url = 'http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-uuidgen';
            var request = $http({
                method: "GET",
                url: url

            });
            request.success(
                function( html ) {
                    $scope.uuidHost = html.host;
                    $scope.uuidType = html.type;
                    $scope.uuidPort = html.port;
                    console.log("success"+html.host);

                }
            )
            request.error(function(){
                console.log("name-server.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.  UUID Service not found.");
            });
        };
        $scope.getAlerter = function () {
            $scope.errorMsg = "";
            var url = 'http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-alerter';
            var request = $http({
                method: "GET",
                url: url

            });
            request.success(
                function( html ) {
                    $scope.alerterHost = html.host;
                    $scope.alerterType = html.type;
                    $scope.alerterPort = html.port;
                    console.log("success"+html.host);

                }
            )
            request.error(function(){
                console.log("name-server.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request. Alerter Service not found.");
            });
        };
        $scope.getKafka = function () {
            $scope.errorMsg = "";
            var url = 'http://pz-discover.cf.piazzageo.io/api/v1/resources/kafka';
            var request = $http({
                method: "GET",
                url: url

            });
            request.success(
                function( html ) {
                    $scope.kafkaHost = html.host;
                    $scope.kafkaType = html.type;
                    $scope.kafkaPort = html.port;
                    console.log("success"+html.host);

                }
            )
            request.error(function(){
                console.log("name-server.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request. Kafka Service not found.");
            });
        };
        $scope.getZookeeper = function () {
            $scope.errorMsg = "";
            var url = 'http://pz-discover.cf.piazzageo.io/api/v1/resources/zookeeper';
            var request = $http({
                method: "GET",
                url: url

            });
            request.success(
                function( html ) {
                    $scope.zookeeperHost = html.host;
                    $scope.zookeeperType = html.type;
                    $scope.zookeeperPort = html.port;
                    console.log("success"+html.host);

                }
            )
            request.error(function(){
                console.log("name-server.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.  Zookeeper Service not found.");
            });
        };

        $scope.getSearch = function () {
            $scope.errorMsg = "";
            var url = 'http://pz-discover.cf.piazzageo.io/api/v1/resources/elasticsearch';
            var request = $http({
                method: "GET",
                url: url

            });
            request.success(
                function( html ) {
                    $scope.searchHost = html.host;
                    $scope.searchType = html.type;
                    $scope.searchPort = html.port;
                    console.log("success"+html.host);

                }
            )
            request.error(function(){
                console.log("name-server.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.  Search Service not found.");
            });
        };

        $scope.getIngest = function () {
            $scope.errorMsg = "";
            var url = 'http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-ingester';
            var request = $http({
                method: "GET",
                url: url

            });
            request.success(
                function( html ) {
                    $scope.ingestHost = html.host;
                    $scope.ingestType = html.type;
                    $scope.ingestPort = html.port;
                    console.log("success"+html.host);

                }
            )
            request.error(function(){
                console.log("name-server.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.  Ingest Service not found.");
            });
        };






    }

})();