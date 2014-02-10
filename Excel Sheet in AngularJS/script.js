// Code goes here
'use strict';

var gridApp = angular.module('gridApp', []);
gridApp.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope, {
          $event: event
        });
      });
    });
  };
});

gridApp.controller('GridCtrl', function($scope, $document, $rootScope) {
  var hideContextMenu = function() {
    $scope.isContextMenuVisible = false;
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  };
  $scope.numRows = 0;
  $scope.numColumns = 0;

  $scope.isContextMenuVisible = false;
  $scope.contextmenuRowIndex = -1;
  $scope.contextmenuColumnIndex = -1
  $scope.openContextMenu = function($event, rowIndex, columnIndex) {
    $event.preventDefault();
    
    if ($event.button === 0) {
      $scope.isContextMenuVisible = false;
      return;
    }

    $scope.contextmenuRowIndex = rowIndex;
    $scope.contextmenuColumnIndex = columnIndex;
    $scope.contextMenuStyle = {
      top: $event.clientY + 'px',
      left: $event.clientX + 'px'
    };
    $scope.isContextMenuVisible = true;
  };
  $scope.addRow = function() {
    var i,
      record,
      cell,
      index = $scope.contextmenuRowIndex;

    record = [];
    for (i = 0; i < $scope.numColumns; i++) {
      cell = {
        value: 'New Cell'
      }
      record.push(cell);
    }

    $scope.records.splice(index, 0, record);
    $scope.isContextMenuVisible = false;
    $scope.numRows = $scope.records.length;
  };
  $scope.removeRow = function() {
    var index = $scope.contextmenuRowIndex;
    $scope.records.splice(index, 1);
    $scope.isContextMenuVisible = false;
    $scope.numRows = $scope.records.length;
  };
  $scope.addColumn = function() {
    var i, record;
    for(i = 0; i < $scope.records.length; i++) {
      record = $scope.records[i];
      record.splice($scope.contextmenuColumnIndex, 0, {value: 'New Col'});
    }
    
    $scope.numColumns = record.length;
  };
  $scope.removeColumn = function() {
    var i, record;
    for(i = 0; i < $scope.records.length; i++) {
      record = $scope.records[i];
      record.splice($scope.contextmenuColumnIndex, 1);
    }
    
    $scope.numColumns = record.length;
  };

  $document.bind('click', function($evt) {
    var target = angular.element($evt.target).closest('table');
    if (target.length === 0) {
      hideContextMenu();
    }
  });

  $scope.init = function() {
    var i, j, column, cell;
    var records = [],
      record;
    $scope.numRows = 10;
    $scope.numColumns = 20;
    for (i = 0; i < $scope.numRows; i++) {
      record = [];
      for (j = 0; j < $scope.numColumns; j++) {
        cell = {
          value: ''
        }
        record.push(cell);
      }
      records.push(record);
    }
    $scope.records = records;
    
  }
  $scope.init();

});