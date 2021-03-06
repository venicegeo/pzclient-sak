/**
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
        .controller('EventtypesController', ['$scope', 'toaster', 'gateway', 'settings', EventtypesController]);

    function EventtypesController ($scope, toaster, gateway, settings) {

        $scope.elasticSearchLimit = settings.elasticSearchLimit;
        $scope.showNewEventTypeForm = false;
        $scope.showEventTypeTable = false;
        $scope.eventTypeMappings = [];
        $scope.disableEventTypeName = false;

        // Pagination
        $scope.totalTypes = 0;
        $scope.typesPerPage = 10;
        $scope.pagination = {
            current: 0
        };
        $scope.pageOptions = [10, 25, 50, 100, 500];
        $scope.pageChanged = function(newPage) {
            $scope.getEventTypes(newPage);
        };
        $scope.getStart = function () {
            return ($scope.pagination.current * $scope.typesPerPage) + 1;
        };
        $scope.getEnd = function () {
            var end = ($scope.pagination.current * $scope.typesPerPage) + $scope.typesPerPage;
            if (end > $scope.totalTypes) {
                return $scope.totalTypes;
            }
            return end;
        };



        $scope.clearForm = function (){
            $scope.disableEventTypeName = false;
            $scope.newEventTypeName = null;
            $scope.newEventTypeParameterName = "";
            $scope.newEventTypeDataType = "";
            $scope.eventTypeMappings = [];

        };
        $scope.addMapping = function (){

            if (!$scope.showEventTypeTable){
                $scope.showNewEventTypeForm = true;
            }
            else{
                $scope.showNewEventTypeForm = false;
            }

            var parameterName = $scope.newEventTypeParameterName;
            var parameterDatatype = $scope.newEventTypeDataType;

            var newMapping = {};
            newMapping[parameterName] = parameterDatatype;

            $scope.eventTypeMappings.push(newMapping);
            $scope.eventTypeName = $scope.newEventTypeName;


            $scope.disableEventTypeName = true;
            $scope.newEventTypeParameterName = "";
            $scope.newEventTypeDataType = "";
        };

        $scope.deleteEventMapping = function(mapKey){
            $scope.eventTypeMappings.splice(mapKey, 1);
        };

        $scope.updateTypeTable = function (eventTypeId) {

            if (!$scope.showEventTypeTable){
                $scope.showEventTypeTable = true;
            }
            else{
                $scope.showeventTypeTable = false;
            }

            gateway.async(
                "GET",
                "/eventType/"+eventTypeId
            ).then(function successCallback( html ) {
                $scope.eventTypeId = html.data.data.eventTypeId;
                $scope.eventTypeName = html.data.data.name;
                $scope.eventTypeMapping = html.data.data.mapping;

            }, function errorCallback(response){
                console.log("eventtypes.controller update type fail: "+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
            });

        };


        $scope.showHideNewEventType = function() {
            $scope.showNewEventTypeForm = !$scope.showNewEventTypeForm;
        };

        $scope.showHideEventTypeTable = function() {
            $scope.showEventTypeTable = !$scope.showEventTypeTable;
        };

        $scope.cancelCreateEventType = function() {
            $scope.showNewEventTypeForm = !$scope.showNewEventTypeForm;
            $scope.clearForm();
        };


        $scope.loadPostEventType = function() {

            $scope.showHideEventTypeTable();

        };

        $scope.getEventTypes = function (pageNumber) {
            $scope.eventType = "";
            $scope.eventTypes = [];

            if (pageNumber) {
                $scope.pagination.current = pageNumber - 1;
            }

            var params = {
                page: $scope.pagination.current,
                perPage: $scope.typesPerPage
            };

            gateway.async(
                "GET",
                "/eventType",
                null,
                params
            ).then(function successCallback( html ) {
                $scope.eventTypes = html.data.data;
                $scope.actualTypeCount = html.data.pagination.count;
                $scope.totalTypes = ($scope.actualTypeCount > $scope.elasticSearchLimit) ? $scope.elasticSearchLimit : $scope.actualTypeCount;
            }, function errorCallback(response){
                console.log("eventtypes.controller get eventtypes fail: "+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
            });

        };

        $scope.createEventType = function(newEventType) {

            var mapping = {};
            $scope.eventTypeMappings.forEach(function(item) {
                var keys = Object.keys(item);
                var key = keys[0];
                mapping[key] = item[key];
            });

            var typeName = $scope.eventTypeName;
            if (angular.isUndefined(typeName) || typeName === "") {
                typeName = $scope.newEventTypeName;
            }
            var eventDataObj = {
                "name": typeName,
                "mapping" : mapping
            };
            gateway.async(
                "POST",
                "/eventType",
                eventDataObj
            ).then(function successCallback(res) {
                $scope.message = res;

                //reload events table
                $scope.getEventTypes();

                //clear input values
                $scope.eventTypeName = null;
                $scope.newEventTypeMapping = null;
                $scope.eventTypeMappings = [];
                $scope.newEventTypeName = "";
                $scope.showHideNewEventType();
                $scope.disableEventTypeName = false;


                toaster.pop('success', "Success", "The event was successfully posted.")

            }, function errorCallback(res) {
                console.log("eventtypes.controller create type fail: "+res.status);

                toaster.pop('error', "Error", "There was a problem submitting the event type message.");
            });
        };

        $scope.selectEventType = function(newEventType) {
            //User selected to create an event associated with an event type

            //TODO: Show/hide new event table
            $scope.showHideNewEventForm();
            $scope.newEventType = newEventType;

            //TODO: On submit, hide the event type table and have toaster pop open showing success.
        };

        $scope.deleteEventType = function(eventTypeId) {
            gateway.async(
                "DELETE",
                "/eventType/"+eventTypeId
            ).then(function successCallback( html ) {
                $scope.message = html;
                console.log("success");

                $scope.eventTypeId = "";
                $scope.eventTypeName = "";
                $scope.eventTypeMapping = "";

                $scope.getEventTypes();

                toaster.pop('success', "Success", "The eventtype was successfully deleted.");
            }, function errorCallback(response) {
                console.log("eventtypes.controller delete eventtype fail: "+response.status);
                toaster.pop('error', "Error", "There was a problem deleting the eventtype.");
            });
        };
    }

})();