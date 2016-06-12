(function(module) {
  'use strict';

  /**
   * Function to configure ui-states for router
   * @param  {Object} routerHelper RouteHelper object
   * @param {Object} localStorage locaStorage service object
   */
  function _appRun(routerHelper, localStorage, Report, $q) {
    routerHelper.configureStates(_getStates(localStorage, Report, $q));
  }

  module.run(_appRun);

  /**
   * Function to configure state for module
   * @param {Object} localStorage locaStorage service object
   * @param {Object} Report       Report resource service
   * @return {Array} Array of ui-states
   */
  function _getStates(localStorage, Report, $q) {
    return [{
      state: 'layout.report',
      config: {
        url: '/report/:id?type',
        resolve: {
          type: function($stateParams) {
            var check_type = $stateParams.type || localStorage.get('formtype').type;
            var checkPromise = $q.defer();
            if (check_type) {
              checkPromise.resolve(check_type);
            } else {
              Report.getBasicChecklistInfo({
                reportid: 'getBasicChecklistInfo'
              }, {
                nid: $stateParams.id
              }, function(data) {
                var checklist = data.message;
                if (checklist) {
                  localStorage.add('formtype', checklist);
                  checkPromise.resolve(checklist.type);
                }
              });
            }
            return checkPromise.promise.then(function(check_type) {
              return check_type;
            });
          }
        },
        templateUrl: function(params) {
          var check_type = params.type || localStorage.get('formtype').type;
          return 'app/checklist/' + check_type + '.html';
        },
        controller: 'checklistController as vm',
        data: {
          backBtn: true
        },
        title: 'Checklist',
        authRequired: true
      }
    }, {
      state: 'layout.csv-upload',
      config: {
        url: '/report/:id/upload',
        templateUrl: 'app/checklist/upload-csv.html',
        data: {
          backBtn: true
        },
        controller: 'uploadController as vm',
        title: 'Import Sensor Data',
        authRequired: true
      }
    }, {
      state: 'layout.choose-axis',
      config: {
        url: '/report/:id/axis',
        templateUrl: 'app/checklist/axis.html',
        data: {
          backBtn: true
        },
        controller: 'axisController as vm',
        title: 'Choose L/R Axis',
        authRequired: true
      }
    }, {
      state: 'layout.importAquaScan',
      config: {
        url: '/importAquaScan',
        templateUrl: 'app/checklist/importFromAquaScan.html',
        resolve: {},
        controller: 'aquaScanController as vm',
        data: {
          backBtn: true
        },
        title: 'Import Aqua Scan',
        authRequired: true
      }
    }];
  }
})(angular.module('app.checklist'));
