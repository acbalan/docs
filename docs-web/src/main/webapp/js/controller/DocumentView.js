'use strict';

/**
 * Document view controller.
 */
App.controller('DocumentView', function($scope, $state, $stateParams, $dialog, Restangular) {
  // Load data from server
  $scope.document = Restangular.one('document', $stateParams.id).get();
  
  /**
   * Configuration for file sorting.
   */
  $scope.fileSortableOptions = {
    forceHelperSize: true,
    forcePlaceholderSize: true,
    tolerance: 'pointer',
    handle: '.handle',
    stop: function(e, ui) {
      // Send new positions to server
      $scope.$apply(function() {
        Restangular.one('file').post('reorder', {
          id: $stateParams.id,
          order: _.pluck($scope.files, 'id')
        });
      });
    }
  };
  
  /**
   * Load files from server.
   */
  $scope.loadFiles = function() {
    Restangular.one('file').getList('list', { id: $stateParams.id }).then(function(data) {
      $scope.files = data.files;
    });
  };
  $scope.loadFiles();
  
  /**
   * Navigate to the selected file.
   */
  $scope.openFile = function(file) {
    $state.transitionTo('document.view.file', { id: $stateParams.id, fileId: file.id })
  };
  
  /**
   * Delete a document.
   */
  $scope.deleteDocument = function(document) {
    var title = 'Delete document';
    var msg = 'Do you really want to delete this document?';
    var btns = [{result:'cancel', label: 'Cancel'}, {result:'ok', label: 'OK', cssClass: 'btn-primary'}];

    $dialog.messageBox(title, msg, btns)
    .open()
    .then(function(result) {
      if (result == 'ok') {
        Restangular.one('document', document.id).remove().then(function() {
          $scope.loadDocuments();
          $state.transitionTo('document.default');
        });
      }
    });
  };
  
  /**
   * Delete a file.
   */
  $scope.deleteFile = function(file) {
    var title = 'Delete file';
    var msg = 'Do you really want to delete this file?';
    var btns = [{result:'cancel', label: 'Cancel'}, {result:'ok', label: 'OK', cssClass: 'btn-primary'}];

    $dialog.messageBox(title, msg, btns)
    .open()
    .then(function(result) {
      if (result == 'ok') {
        Restangular.one('file', file.id).remove().then(function() {
          $scope.loadFiles();
        });
      }
    });
  }
});