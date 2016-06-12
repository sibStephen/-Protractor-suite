(function(module) {
  'use strict';
  module.controller('aquaScanController', function($rootScope, Report, $state,
    $timeout) {
    var vm = this;
    vm.listOfImportedReports = [];

    /**
     * Success callback function for following API calls:
     * ['getReportsFromAquaScan', 'getReportsFromAquaScan']
     * @param  {Object} d   API return object
     */
    var successCB = function(d) {
      if (d.code === 'SERVICE_FAILED') {
        vm.message = d.message;
        vm.listOfImportedReports.length = 0;
      }
      if (d.code === 'SERVICE_SUCCESS') {
        $timeout(function() {
          $rootScope.$emit('checklist_data', d.message);
        }, 1000);
        $state.go('layout.report', {
          type: 'checklist'
        });
      }
    };

    /**
     * Function to Import Checklist data from AquaScan API
     * @param  {String} reportid ReportID to get data from AquaScan
     */
    vm.import = function(reportid) {
      Report.getReports({
        reportid: 'getAquascanCorrespondingReports'
      }, {
        aquascan_report_id: reportid
      }, function(reports) {
        if (reports.code === 'SERVICE_FAILED') {
          Report.getReportsFromAquaScan({
            apikey: 'aquascanapicode12345',
            report_id: reportid
          }, successCB);
        } else if (reports.code === 'SERVICE_SUCCESS') {
          vm.listOfImportedReports = reports.message;
        }
      });
    };

    /**
     * Function to fill the data (imported from Scan) into checklist form
     * @param  {String} reportid AquaScan reportID to get data from
     */
    vm.continue = function(reportid) {
      Report.getReportsFromAquaScan({
        apikey: 'aquascanapicode12345',
        report_id: reportid
      }, successCB);
    };
  });
})(angular.module('app.checklist'));
