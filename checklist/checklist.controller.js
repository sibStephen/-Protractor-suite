(function(module) {
  'use strict';
  module.controller('checklistController', function($rootScope, $uibModal,
    Internet, Report, $scope, $q, localStorage, toastr, $timeout, Term,
    $state, $stateParams, accordionService, BuTree) {
    var vm = this;
    vm.searchButtonText = 'Continue';
    vm.saveButtonText = 'Save';
    vm.submitButtonText = 'Submit';
    var defered;
    vm.active = false;
    vm.isMobile = window.mobileAndTabletcheck();
    vm.data = {};
    vm.datepickeropen = false;
    vm.datepickerOption = {
      showWeeks: false,
      showButtonBar: false
    };
    vm.todaysdate = new Date() / 1000;
    vm.showvalidationmsg = false;
    vm.businessUnitData = [];
    vm.sectorData = [];
    vm.subSectorData = [];
    vm.departmentData = [];
    vm.applicationMethodData = {};
    vm.data.department = [{
      field_departments: {
        und: [{
          tid: '0'
        }]
      },
      field_application_method: {
        und: [{
          tid: '0'
        }]
      }
    }];
    var type = localStorage.get('formtype') && localStorage.get(
      'formtype').type || $stateParams.type;

    vm.resetObservations = function(type) {
      vm.data[type] = [{
        field_description_of_surface: {
          und: [{}]
        },
        field_description_of_location_of: {
          und: [{}]
        },
        field_photo: {
          und: [{}]
        }
      }];
    };
    if (type === 'cip_tools_checklist') {
      // var observation_fields = ['field_test_visually', 'field_test_uv', 'field_test_endoscopic', 'field_test_atp', 'field_test_micro', 'field_test_allergens'];
      // this is not working for add more fields when put in foreach :(
      vm.data.field_test_visually = [{
        field_description_of_surface: {
          und: [{}]
        },
        field_description_of_location_of: {
          und: [{}]
        },
        field_photo: {
          und: [{}]
        }
      }];
      vm.data.field_test_uv = [{
        field_description_of_surface: {
          und: [{}]
        },
        field_description_of_location_of: {
          und: [{}]
        },
        field_photo: {
          und: [{}]
        }
      }];
      vm.data.field_test_endoscopic = [{
        field_description_of_surface: {
          und: [{}]
        },
        field_description_of_location_of: {
          und: [{}]
        },
        field_photo: {
          und: [{}]
        }
      }];
      vm.data.field_test_atp = [{
        field_description_of_surface: {
          und: [{}]
        },
        field_description_of_location_of: {
          und: [{}]
        },
        field_photo: {
          und: [{}]
        }
      }];
      vm.data.field_test_micro = [{
        field_description_of_surface: {
          und: [{}]
        },
        field_description_of_location_of: {
          und: [{}]
        },
        field_photo: {
          und: [{}]
        }
      }];
      vm.data.field_test_allergens = [{
        field_description_of_surface: {
          und: [{}]
        },
        field_description_of_location_of: {
          und: [{}]
        },
        field_photo: {
          und: [{}]
        }
      }];
      // Cleaning product fields
      vm.data.cleaning_chemical_product = [{
        field_cost: {
          und: [{}]
        },
        field_unit: {
          und: [{}]
        }
      }];
    }
    if (type === 'checklist') {
      vm.data.water_supply = [];
      vm.data.water_supply[0] = {};
      vm.data.water_supply[0].field_water_custom = {};
      vm.data.water_supply[0].field_water_custom.und = [];
      vm.data.water_supply[0].field_water_custom.und[0] = {
        field_incoming_cost_per_unit: {
          und: [{}]
        },
        field_outgoing_cost_per_unit: {
          und: [{}]
        },
        field_water_unit: {
          und: [{}]
        },
        field_water_supply_source_name: {
          und: [{}]
        },
        field_water_source_type: {
          und: [{}]
        }
      };
      // vm.data.value_stream=[];
      vm.data.value_stream = [{
        field_incoming_cost_per_unit: {
          und: [{}]
        },
        field_outgoing_cost_per_unit: {
          und: [{}]
        },
        field_water_unit: {
          und: [{}]
        },
        field_stream_name: {
          und: [{}]
        }
      }];
    }
    vm.data[type] = [{
      field_sub_sector: {
        und: [{
          tid: '0'
        }]
      }
    }];
    vm.data[type] = [{
      field_sector: {
        und: [{
          tid: '0'
        }]
      }
    }];
    /**
     * Function to get children of given tid
     * @param  {Array}  arr  Array containing all the terms
     * @param  {Int}    tid  Tid to get children for
     * @return {Promise}    Resolve promise and return children
     */
    var getChildren = function(arr, tid) {
      var dropdowndefered = $q.defer();
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].tid == tid) {
          arr[i].show = false;
          var childrens = arr[i].children || [];
          dropdowndefered.resolve(childrens);
          return dropdowndefered.promise;
        }
      }
      dropdowndefered.resolve([]);
      return dropdowndefered.promise;
    };
    /**
     * Business unit dropdown config object
     */
    vm.businessUnitConfig = {
      valueField: 'tid',
      labelField: 'name',
      searchField: ['name'],
      maxItems: 1,
      onChange: function(v) {
        vm.data[type][0].field_sector.und[0].tid = '0';
        vm.data[type][0].field_sub_sector.und[0].tid = '0';
        vm.data.department = [{
          field_departments: {
            und: [{
              tid: '0'
            }]
          },
          field_application_method: {
            und: []
          }
        }];
        defered.then(function(d) {
          getChildren(d.message, v).then(function(s) {
            vm.sectorData = s;
          });
        });
      }
    };
    /**
     * Sector dropdown config object
     */
    vm.sectorConfig = {
      valueField: 'tid',
      labelField: 'name',
      searchField: ['name'],
      maxItems: 1,
      onChange: function(v) {
        vm.data[type][0].field_sub_sector.und[0].tid = '0';
        vm.data.department = [{
          field_departments: {
            und: [{
              tid: '0'
            }]
          },
          field_application_method: {
            und: []
          }
        }];
        getChildren(vm.sectorData, v).then(function(d) {
          vm.subSectorData = d;
        });
      }
    };
    /**
     * Sub-sector dropdown config object
     */
    vm.subSectorConfig = {
      valueField: 'tid',
      labelField: 'name',
      searchField: ['name'],
      maxItems: 1,
      onChange: function(v) {
        vm.data.department = [{
          field_departments: {
            und: [{
              tid: '0'
            }]
          },
          field_application_method: {
            und: []
          }
        }];
        getChildren(vm.subSectorData, v).then(function(d) {
          angular.forEach(d, function(e) {
            e.show = true;
          });
          vm.departmentData = d;
          vm.filteredDepartment(d);
        });
      }
    };
    /**
     * Department dropdown config object
     */
    vm.departmentConfig = {
      valueField: 'tid',
      labelField: 'name',
      searchField: ['name'],
      maxItems: 1,
      hideSelected: true
    };
    /**
     * Application method dropdown config object
     */
    vm.applicationMethodConfig = {
      valueField: 'tid',
      labelField: 'name',
      searchField: ['name'],
      onChange: function() {}
    };
    vm.departmentArr = [];
    /**
     * FUnction to get department details from array
     * @param  {Array} arr  Array containing all the terms:
     * (bu, sec, subsec, depart, app_method)
     * @param  {Int} dtid Department TID
     */
    vm.filteredDepartment = function(arr, dtid) {
      var len = vm.data.department.length;
      var arrLen = arr.length;
      for (var i = 0; i < len; i++) {
        var tid = vm.data.department[i] && vm.data.department[i].field_departments &&
          vm.data.department[i].field_departments.und[0].tid;
        vm.departmentArr[i] = [];
        for (var j = 0; j < arrLen; j++) {
          if (dtid && arr[j].tid == dtid) {
            arr[j].show = true;
          }
          if (arr[j].show === true || tid == arr[j].tid) {
            vm.departmentArr[i].push(arr[j]);
          }
        }
      }
    };
    /**
     * Function to handle change event of business unit, sector, sub-sector,
     * departemnt and application method
     * @param  {Int}    v        Department ID
     * @param  {String} oldVal   Model to get old value
     */
    vm.change = function(v, oldVal) {
      vm.applicationMethodData[v] = [];
      getChildren(vm.departmentData, v).then(function(d) {
        vm.filteredDepartment(vm.departmentData, oldVal);
        vm.applicationMethodData[v] = d;
      });
    };
    /**
     * Function to get country list from json file
     * vm.countries Assign countries to angular scope variable
     */
    Term.getCountry(function(d) {
      vm.countries = d;
    });
    defered = Term.getTerms({
      action: 'getTree'
    }, {
      vid: BuTree
    }, function(data) {
      vm.businessUnitData = data.message;
    });

    var _updateDowndown = function(data) {
      var butid = data[type][0].field_business_unit && data[type][0]
      .field_business_unit.und[0] && data[
          type][0].field_business_unit.und[0].tid;
      var sectid = data[type][0].field_sector && data[
          type][0].field_sector.und[0] && data[type][0].field_sector
        .und[0].tid;
      var subsectid = data[type][0].field_sub_sector &&
        data[type][0].field_sub_sector.und[0] && data[
          type][0].field_sub_sector.und[0].tid;
      if (butid !== 0) {
        defered.then(function(s) {
          getChildren(s.message, butid).then(function(d) {
            vm.sectorData = d;
            if (sectid !== 0) {
              getChildren(vm.sectorData, sectid).then(
                function(k) {
                  vm.subSectorData = k;
                  if (subsectid != 0) {
                    getChildren(vm.subSectorData,
                      subsectid).then(function(l) {
                      vm.departmentData = l;
                      var department = data.department ||
                        [];
                      angular.forEach(department,
                        function(dept) {
                          if (dept.field_departments &&
                            dept.field_departments.und
                          ) {
                            var s = dept.field_departments
                              .und[0].tid;
                            vm.applicationMethodData[
                              s] = [];
                            getChildren(vm.departmentData,
                              s).then(function(a) {
                              vm.filteredDepartment(
                                vm.departmentData
                              );
                              vm.applicationMethodData[
                                s] = a;
                            });
                          }
                        });
                    });
                  }
                });
            }
          });
        });
      }
    };
    /**
     * Function to get all the dropdown options
     * vm.terms Assign returned data to vm.terms scope variable
     */
    Term.getTerms({
      action: 'getTreeMultiple'
    }, null, function(data) {
      vm.terms = data.message;
    });
    $rootScope.$on('checklist_data', function(e, v) {
      angular.merge(vm.data, v);
      _updateDowndown(vm.data);
    });
    if ($stateParams.id) {
      vm.active = true;
      Report.get({
        reportid: $stateParams.id
      }, function(data) {
        if (data.message.checklist_basic_info) {
          if (!type) {
            type = data.message.checklist_basic_info.type;
          }
        }
        vm.data = data.message;
        _updateDowndown(vm.data);
      });
    } else {
      // Report ID
      var user_name = 'admin'.toUpperCase();
      var new_report_id = user_name.substr(0, 2) + '-' + Date.now();
      vm.data[type] = [{
        field_report_id: {
          und: [{
            value: new_report_id
          }]
        }
      }];
    }
    vm.current = 0;
    $scope.$on('accordionService:change', function(e, val) {
      vm.current = val.index;
    });
    /**
     * Function to open image in modal box
     * @param  {Object} modelRef image information in modal
     * @param {String} image image src
     * @param {Boolean} finalized if assessment is finalized
     */
    $scope.open = function(modelRef, image, finalized) {
      $uibModal.open({
        templateUrl: 'app/checklist/image-modal.html',
        windowClass: 'annotation-modal modal-thumbnail',
        controller: function($scope, $uibModalInstance,
          annotateService) {
          $scope.finalized = finalized;
          $scope.imageOptions = {
            // Height of canvas
            color: 'red',
            // Color for shape and text
            type: 'rectangle',
            bootstrap: true,
            // default shape: can be "rectangle", "arrow" or "text"
            images: [],
            // Array of images path : ["images/image1.png", "images/image2.png"]
            linewidth: 2,
            // Line width for rectangle and arrow shapes
            fontsize: '20px',

            hideAnnotation: finalized
          };
          var img = {};
          if (image.base64) {
            img.path = 'data:' + modelRef.filetype + ';base64,' +
              image
              .base64;
            img.cors = false;
          } else {
            img.path = image.absoluteUrl;
            img.cors = true;
          }
          $scope.imageOptions.images.push(img);
          $scope.save = function() {
            annotateService.export({
              type: image.filetype || modelRef.filemime
            }, function(d) {
              if (modelRef.preview_url) {
                delete modelRef.preview_url;
                delete modelRef.fid;
                delete modelRef.absolute_url;
                modelRef.filetype = modelRef.filemime;
              }
              modelRef.base64 = d.split(',')[1];
            });
            $uibModalInstance.close();
          };
          $scope.cancel = function() {
            annotateService.destroy();
            $uibModalInstance.dismiss('Cancel!');
          };
        }
      });
    };
    /**
     * Function to handle accordion functionality
     * @param  {Int} nextAccordionNumber Next accordion number
     * @TODO remove form param, its not used
     */
    vm.goNext = function(form, nextAccordionNumber) {
      vm.searchButtonText = 'Processing';
      $timeout(function() {
        vm.searchButtonText = 'Continue';
      }, 400);
      accordionService.nextAccordion(nextAccordionNumber);
    };
    /**
     * Function to save checklist data to drupal
     * @param  {Array} formData cheklist form data (from field models)
     */
    vm.save = function(formData) {
      vm.showvalidationmsg = false;
      vm.saveButtonText = 'Saving';
      if (!formData[type][0].status) {
        formData[type][0].status = 0;
      }
      formData[type][0].created = new Date() / 1000;
      Report.save(formData, function(data) {
        vm.saveButtonText = 'Save';
        if (data.code === 'SERVICE_SUCCESS') {
          toastr.success('Saved Successfully!');
          $state.go('layout.csv-upload', {
            id: data.message.nid
          });
        } else if (data.code === 'SERVICE_FAILED') {
          toastr.error('Something Went Wrong!');
        }
      }, function() {
        toastr.error('Something Went Wrong!');
      });
    };
    /**
     * Function to submit checklist data to drupal
     * @param  {Array} formData  cheklist form data (from field models)
     * @param  {Object} form     Angular form object
     */
    vm.submit = function(formData, form) {
      vm.showvalidationmsg = true;
      vm.submitButtonText = 'Submitting';
      if (form.$valid === true) {
        formData[type][0].status = 1;
        formData[type][0].created = new Date() / 1000;
        Report.save(formData, function(data) {
          if (data.code == 'SERVICE_SUCCESS') {
            toastr.success('Submitted Successfully !');
            var checklist_info = localStorage.get('formtype');
            if (checklist_info.nid) {
              checklist_info.status = 1;
              localStorage.add('formtype', checklist_info);
            }
            $state.go('layout.csv-upload', {
              id: data.message.nid
            });
          } else if (data.code == 'SERVICE_FAILED') {
            vm.submitButtonText = 'Submit';
            toastr.error('Something Went Wrong!');
          }
        });
      } else {
        vm.submitButtonText = 'Submit';
        accordionService.openAll();
      }
    };
    /**
     * Function to add more row to current row in form
     * @param {Array} arrName Model in which we need to add items
     */
    vm.addMore = function(arrName) {
      arrName.push({});
    };
    /**
     * Funtion to delete rows from form
     * @param  {Array} arr    Array from which we need to delete item
     * @param  {Int} indexy   Index of item which needs to be deleted
     */
    vm.deleteRepeat = function(arr, indexy) {
      if (arr.length > 1) {
        arr.splice(indexy, 1);
      }
    };

    /**
     * Function to show modal for add labels for department and application
     */
    vm.applyLabels = function() {
      var department_tree = _generate_tree_structure_select_department_apps(
        vm.data.department, vm.departmentData);
      if (Object.keys(department_tree).length) {
        $uibModal.open({
          templateUrl: 'app/checklist/apply-labels.html',
          windowTopClass: 'modal-large modal-ap',
          controller: function($scope, $uibModalInstance) {
            var al = this;
            al.departments = department_tree;
            al.terms = {};
            // If the existing values and send to ng-model
            if (vm.data[type][0].field_term_labels &&
                      vm.data[type][0].field_term_labels.und) {
              var text_label = vm.data[type][0].field_term_labels.und[0] &&
                                vm.data[type][0].field_term_labels.und[0].value;
              if (text_label && text_label.length) {
                var terms = text_label.split('\n');
                terms.forEach(function(term) {
                  var arr = term.split('|');
                  al.terms[arr[0]] = {
                    label: arr[1]
                  };
                });
              }
            }

            var terms_to_keep = Object.keys(al.departments);
            angular.forEach(al.departments, function(department) {
              var children = Object.keys(department.children);
              terms_to_keep = terms_to_keep.concat(children);

              // Intial/default values for fields
              if (!al.terms[department.tid] || al.terms[department.tid].label === '') {
                al.terms[department.tid] = {
                  label: department.name
                };
              }
              angular.forEach(department.children, function(app) {
                if (!al.terms[app.tid] || al.terms[app.tid].label === '') {
                  al.terms[app.tid] = {
                    label: app.name
                  };
                }
              });
            });

            $scope.save = function(formdata) {
              var labels_string = '';
              angular.forEach(formdata, function(term, tid) {
                tid = tid.toString();
                if (terms_to_keep.indexOf(tid) < 0) {
                  delete formdata[tid];
                } else {
                  labels_string += tid + '|' + term.label + '\n';
                }
              });

              // Set key|value string in node field
              vm.data[type][0].field_term_labels = {
                und: [{
                  value: labels_string
                }]
              };

              $uibModalInstance.close();
            };
          },
          controllerAs: 'al'
        });
      }
    };

    /**
     * Private function to generate tree for department and app methods
     * @param  {Array} select_nodes Selected department and apps rows
     * @param  {Array} departments  All department for check
     * @return {Object}  return tree containing selected department and
     * application methods
     */
    function _generate_tree_structure_select_department_apps(select_nodes, departments) {
      var department_tree = {};
      select_nodes.forEach(function(selected_node) {
        var selected_dtid = selected_node.field_departments.und[0].tid;
        // get the selected department
        departments.forEach(function(department) {
          if (department.tid == selected_dtid) {
            department_tree[selected_dtid] = angular.copy(department);
          }
        });
        if (Object.keys(department_tree).length) {
          // make copy of children of selected department
          var sdc = angular.copy(department_tree[selected_dtid].children);

          var selected_apps = selected_node.field_application_method &&
                              selected_node.field_application_method.und;
          // Empty selected department childrens
          department_tree[selected_dtid].children = {};
          if (selected_apps.length) {
            selected_apps.forEach(function(app) {
              var selected_atid = app.tid;
              sdc.forEach(function(child) {
                if (child.tid == selected_atid) {
                  department_tree[selected_dtid].children[selected_atid] = child;
                }
              });
            });
          }
        }
      });
      return department_tree;
    }

    /**
     * Function to show modal for add new department and application
     * @param {String} modal_type Department or aplication method?
     */
    vm.addTerm = function(modal_type) {
      // Department modal box
      var sub_sector_tid = vm.data[type][0].field_sub_sector.und[0].tid;
      if (sub_sector_tid) {
        if (modal_type === 'department') {
          $uibModal.open({
            templateUrl: 'app/checklist/add-department.html',
            controller: function($scope, $uibModalInstance, Term, BuTree) {
              var ad = this;
              ad.sub_sector_tid = sub_sector_tid;
              $scope.save = function(formData) {
                // Prepare term object
                var term_json = {
                  name: formData.dname,
                  vid: BuTree,
                  parent: ad.sub_sector_tid
                };
                Term.save(term_json, function(res) {
                  if (res.code === 'SERVICE_SUCCESS' && res.message.tid) {
                    var idx = vm.subSectorData.findIndexByProp(ad.sub_sector_tid, 'tid');
                    if (!vm.subSectorData[idx].children) {
                      vm.subSectorData[idx].children = [];
                    }
                    vm.subSectorData[idx].children.push(res.message);
                    var didx = vm.departmentData.findIndexByProp(res.message.tid, 'tid');
                    if (didx < 0) {
                      vm.departmentData.push(res.message);
                    }
                    vm.filteredDepartment(vm.departmentData, res.message.tid);
                  }
                });
                $uibModalInstance.close();
              };
            },
            controllerAs: 'ad'
          });
        }
        // Application method modal box
        if (modal_type === 'app') {
          $uibModal.open({
            templateUrl: 'app/checklist/add-application.html',
            controller: function($scope, $uibModalInstance) {
              var adapm = this;
              adapm.data = {};
              adapm.departments = vm.departmentData;
              var d_rows = vm.data.department;
              adapm.data.dtid = d_rows[d_rows.length - 1].field_departments.und[0].tid;
              $scope.save = function(formData) {
                // Prepare term object
                var term_json = {
                  name: formData.app_name,
                  vid: BuTree,
                  parent: formData.dtid
                };
                Term.save(term_json, function(res) {
                  if (res.code === 'SERVICE_SUCCESS' && res.message.tid) {
                    var idx = vm.departmentData.findIndexByProp(formData.dtid, 'tid');
                    if (!vm.departmentData[idx].children) {
                      vm.departmentData[idx].children = [];
                    }
                    vm.departmentData[idx].children.push(res.message);
                    var aidx = vm.applicationMethodData[formData.dtid].findIndexByProp(res.message.tid, 'tid');
                    if (aidx < 0) {
                      vm.applicationMethodData[formData.dtid].push(res.message);
                    }
                  }
                });
                $uibModalInstance.close();
              };
            },
            controllerAs: 'adapm'
          });
        }
      }
    };
  });
})(angular.module('app.checklist'));
