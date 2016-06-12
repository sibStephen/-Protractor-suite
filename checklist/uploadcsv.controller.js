(function(module) {
  'use strict';
  // Define constants for energy calculations
  module.constant('VOL_GL_MULTI', 0.003785412534257983)
    .constant('VOL_M3_MULTI', 1)
    .constant('CPD_F', 2200.8987)
    .constant('CPD_C', 4179)
    .constant('EN_KH_F', 0.0002930712104)
    .constant('EN_BU_F', 1)
    .constant('EN_KJ_F', 1.055055987)
    .constant('EN_KH_C', 0.0002777777778)
    .constant('EN_BU_C', 0.947817)
    .constant('EN_KJ_C', 1);

  module.controller('uploadController', function(toastr, $scope, Term, Report,
      runchartVid, $stateParams, $state, localStorage, $uibModal, Utility,
      VOL_GL_MULTI, VOL_M3_MULTI, CPD_F, CPD_C, EN_KH_F, EN_BU_F, EN_KJ_F,
      EN_KH_C, EN_BU_C, EN_KJ_C) {
      $scope.checklist_id = $stateParams.id;
      var vm = this;
      var ext_reg = new RegExp('^.+\\.([^.]+)$');
      var term_json = {};
      var base_tid = 0;
      vm.files = [];
      vm.file = {};
      vm.data = {};
      vm.data.left_axis = [];
      vm.data.right_axis = [];
      vm.csv_title = '';
      vm.isUploaded = false;
      vm.arrangeAxis = false;
      vm.checklist_info = localStorage.get('formtype');
      Term.getTerms({
        action: 'getTermsbyNode'
      }, {
        nid: $stateParams.id,
        field: 'field_chart_name'
      }, function(res) {
        if (res.code === 'SERVICE_SUCCESS') {
          var base_term = res.message;
          base_tid = Object.keys(base_term)[0];
          if (base_tid) {
            term_json.id = base_tid - 0;
            if (base_term[base_tid].csv_data) {
              vm.isUploaded = true;
              var csv_files = base_term[base_tid].csv_data;
              if (csv_files.length > 1) {
                // remove first one, which will be merged one
                var first_row = csv_files.shift();
                vm.file = JSON.parse(first_row.value);
                csv_files.forEach(function(file) {
                  vm.files.push(JSON.parse(file.value));
                });
              } else if (csv_files.length && csv_files[0].value) {
                vm.file = JSON.parse(csv_files[0].value);
                vm.files.push(JSON.parse(csv_files[0].value));
              }

              vm.csv_title = base_term[base_tid].name;
              vm.axis_selection(vm.file);
            }
          }
        }
      });

      /**
       * Watch the input file change
       */
      $scope.$watch('csv_file', function(newValue) {
        if (newValue && newValue.name) {
          vm.filename = newValue.name;
          var filetype = ext_reg.exec(newValue.name);
          if (filetype[1] === 'csv' || filetype[1] === 'CSV') {
            $scope.uploadcsv.field_csv_upload.$setValidity('type', true);
            vm.csv_file = newValue;
          } else {
            $scope.uploadcsv.field_csv_upload.$setValidity('type',
              false);
          }
        } else {
          vm.filename = 'Select a file';
        }
      });
      var _uncheckCheckboxes = function() {
        angular.element('.div-multiselect input').prop('checked', false);
      };

        /**
         * Function to parse csv file and process data
         * @param  {File} file   File Object
         */
      vm.upload = function(file) {
        if (file && file.name) {
          var filetype = ext_reg.exec(file.name);
          if (filetype[1] === 'csv' || filetype[1] === 'CSV') {
            Papa.parse(file, {
              skipEmptyLines: true,
              complete: function(results) {
                if (!results.errors.length) {
                  var processed_data = _process_data(results.data);
                  // Update the scope
                  $scope.$apply(function() {
                    vm.isUploaded = true;
                    var new_file = {
                      file_name: file.name,
                      data: processed_data
                    };
                    vm.files.push(new_file);
                    if (vm.files.length === 1) {
                      vm.file = new_file;
                      vm.csv_title = new_file.file_name;
                      vm.axis_selection(vm.file);
                    } else {
                      _merge_csv_files();
                    }
                  });
                }
              }
            });
            // Remove file from scope
            $scope.csv_file = null;
            // Reset form
            angular.element('#fileupload').val(null);
          } else {
            toastr.error('Wrong file type, Please upload CSV file!');
          }
        }
      };

      /**
       * Private function to process csv data
       * @param  {Array} data          Array of csv file
       * @return {Array} groupedData   Array of processed data
       */
      function _process_data(data) {
        var groupedData = [];
        var yOnlyData = data;
        var col_headers = data[0];
        var uts;
        var temp_val;
        yOnlyData.shift();
        col_headers.forEach(function(value, key) {
          if (key != 0) {
            var group = {
              name: value,
              originalName: value,
              color: Utility.randomColor(),
              data: []
            };
            yOnlyData.forEach(function(v) {
              var date = v[0];
              var jstimestamp = moment(date, ['DD.MM.YYYY hh:mm:ss', 'DD-MM-YYYY hh:mm:ss', 'DD/MM/YYYY hh:mm:ss']).utc().valueOf();
              temp_val = null;
              if (!isNaN(parseFloat(v[key]))) {
                temp_val = parseFloat(v[key]);
              }
              var temp = [jstimestamp, temp_val];
              group.data.push(temp);
            });
            groupedData.push(group);
          }
        });
        return groupedData;
      }

      /**
       * Merge all the files, update the vm.file after merge
       * @param {Boolean} reset  TRUE means removing
       */
      function _merge_csv_files(reset) {
        var merged_row = angular.copy(vm.file);
        var files = angular.copy(vm.files);
        // Ignore first row as it's merged one
        if (reset) {
          merged_row = files.shift();
        }

        // Get existing column names
        var prev_columns = [];
        merged_row.data.forEach(function(pcol) {
          prev_columns.push(pcol.originalName);
        });

        var idx;
        var prev_col_time;
        var col_name;
        // Each remaining files
        files.forEach(function(file) {
          // Process the new columns
          file.data.forEach(function(col) {
            col_name = col.originalName ? col.originalName : col.name;
            // If this new data for old column
            if (prev_columns.indexOf(col_name) > -1) {
              merged_row.data.forEach(function(mcol) {
                if (col_name === mcol.originalName) {
                  // Store time (xAxis points) for current column
                  prev_col_time = [];
                  mcol.data.forEach(function(axis) {
                    prev_col_time.push(axis[0]);
                  });
                  // Add new time row in column
                  col.data.forEach(function(axisdata) {
                    idx = prev_col_time.indexOf(axisdata[0]);
                    if (idx < 0) {
                      mcol.data.push(axisdata);
                    } else {
                      // if this time is there in previous data but null then
                      mcol.data[idx][1] = axisdata[1];
                    }
                  });
                }
              });
            } else {
              merged_row.data.push(col);
            }
          });
        });

        vm.file = merged_row;
        vm.axis_selection(vm.file);
      }

      /**
       * Function to save taxonomy to drupal and redirect to Runchart page
       * Before this function no data is saved
       */
      vm.save = function() {
        var files = angular.copy(vm.files);
        var csv_data = angular.copy(vm.file);
        csv_data = _sort_csv_data_time(csv_data);
        var right_axis = vm.right_axises;
        angular.forEach(csv_data.data, function(column, index) {
          if (right_axis.indexOf(column.name) > -1) {
            csv_data.data[index].yAxis = 1;
          } else {
            csv_data.data[index].yAxis = 0;
          }
        });
        // Prepare json format to save data as Term in Drupal
        var term_json = {
          nid: $stateParams.id,
          vid: runchartVid,
          name: vm.csv_title,
          field_data: {
            und: [{
              value: JSON.stringify(csv_data)
            }]
          }
        };
        if (files.length) {
          files.forEach(function(f, i) {
            term_json.field_data.und[i + 1] = {
              value: JSON.stringify(f)
            };
          });
        }
        // Update old mate
        if (base_tid && !isNaN(base_tid)) {
          term_json.tid = base_tid;
        }
        // Update the node with csv data
        Report.updateBaseChart({
          reportid: 'updateBaseChart'
        }, {
          nid: $stateParams.id,
          data: term_json
        }, function() {
          var checklist_info = localStorage.get('formtype');
          if (checklist_info.nid && !checklist_info.IsRunchartDone) {
            checklist_info.IsRunchartDone = true;
            localStorage.add('formtype', checklist_info);
          }
          $state.go('layout.runchart', {
            id: $stateParams.id
          });
        }, function() {
          toastr.error('Something Went Wrong!');
        });
      };

      // Remove csv
      // @TODO revisit after merge
      vm.remove_csv = function(arr, indexy) {
        if (window.confirm(
            'All the underlying data and related analysis data mapping will be lost. Do you want to continue?'
          )) {
          var csv_data = vm.file;
          csv_data = _sort_csv_data_time(csv_data);
          arr.splice(indexy, 1);
          if (!arr.length) {
            vm.isUploaded = false;
            csv_data = null;
          } else {
            _merge_csv_files(true);
          }
          if (base_tid && !isNaN(base_tid)) {
            if (!arr.length) {
              base_tid = 0;
              vm.csv_title = '';
            }
            // Prepare json format to save data as Term in Drupal
            var term_json = {
              nid: $stateParams.id,
              vid: runchartVid,
              tid: base_tid,
              name: vm.csv_title,
              field_data: {
                und: [{
                  value: csv_data ? JSON.stringify(csv_data) : ''
                }]
              }
            };
            if (arr.length) {
              arr.forEach(function(f, i) {
                term_json.field_data.und[i + 1] = {
                  value: JSON.stringify(f)
                };
              });
            }

            Report.updateBaseChart({
              reportid: 'updateBaseChart'
            }, {
              nid: $stateParams.id,
              data: term_json
            }, function(res) {
              if (res.code === 'SERVICE_SUCCESS') {
                var checklist_info = localStorage.get('formtype');
                if (checklist_info.nid && !arr.length) {
                  checklist_info.IsRunchartDone = false;
                  checklist_info.IsAnalysisDone = false;
                  localStorage.add('formtype', checklist_info);
                }
                toastr.success('Removed Successfully!');
              } else {
                toastr.error(res.message);
              }
            });
          }
        }
      };

      /**
       * Function to sort csv data with time
       * @param  {Array} csv_data merged file with all the columns
       * @return {Array} return sorted data
       */
      function _sort_csv_data_time(csv_data) {
        csv_data.data.forEach(function(column) {
          column.data.sort(function(a, b) {
            return (a[0] - b[0]);
          });
        });
        return csv_data;
      }

      /**
       * Function to provide Left/Right axis selection lists
       * @param  {Object}  file  Array of current merged file object
       */
      vm.axis_selection = function(file) {
        if (!file) {
          file = vm.file;
        }
        if (vm.isUploaded) {
          var headers_left = [];
          var headers_right = [];
          angular.forEach(file.data, function(column) {
            if (column.yAxis) {
              headers_right.push(column.name);
            } else {
              headers_left.push(column.name);
            }
          });
          vm.left_axises = headers_left;
          vm.right_axises = headers_right;
        }
      };

      /**
       * Funtion to move left axis select list item to right axis select list
       * @param {Array} axis  Array of items which needs to be moved to right
       */
      vm.addRightAxis = function(axis) {
        if (!axis || !axis.length || vm.left_axises.indexOf(axis[0]) < 0) {
          var vals = angular.element('#field_left_axis').val();
          if (vals && vals.length) {
            axis = vals;
          }
        }
        if (!angular.isUndefined(axis) && axis.length) {
          axis.forEach(function(val) {
            var index = vm.left_axises.indexOf(val);
            if (index > -1) {
              vm.left_axises.splice(index, 1);
              vm.right_axises.push(val);
            }
          });
          axis.length = 0;
          _uncheckCheckboxes();
        }
      };

      /**
       * Funtion to move right axis select list item to left axis select list
       * @param {Array} axis  Array of items which needs to be moved to left
       */
      vm.addLeftAxis = function(axis) {

        if (!axis || !axis.length || vm.right_axises.indexOf(axis[0]) < 0) {
          var vals = angular.element('#field_right_axis').val();
          if (vals && vals.length) {
            axis = vals;
          }
        }
        if (!angular.isUndefined(axis) && axis.length) {
          axis.forEach(function(val) {
            var index = vm.right_axises.indexOf(val);
            if (index > -1) {
              vm.right_axises.splice(index, 1);
              vm.left_axises.push(val);
            }
          });
          axis.length = 0;
          _uncheckCheckboxes();
        }
      };

      /**
       * Function to open modal window for computed columns
       */
      vm.open = function() {
        $uibModal.open({
          templateUrl: 'app/checklist/cp.html',
          windowTopClass: 'modal-large modal-cp',
          controller: function($scope, $uibModalInstance,
            localStorage) {
            var cp = this;
            var touched = false;
            cp.checklist_info = localStorage.get('formtype');
            var files = vm.file;
            cp.columns = [];
            cp.computed_columns = [];
            cp.vol_columns = [];
            cp.formulas = {
              acc_vol: {
                id: 'acc_vol',
                fname: 'Accumulated Volume',
                name: 'Volume',
                acc_name: 'Acc Vol',
                vol_csv_params: ['Flow Rate']
              },
              acc_energy: {
                id: 'acc_energy',
                fname: 'Accumulated Energy',
                name: 'Energy',
                acc_name: 'Acc Energy'
              }
            };
            cp.units = {
              time_unit: [{
                label: 'gallons/min',
                data: '60'
              }, {
                label: 'litres/min',
                data: '60'
              }, {
                label: 'm3/hr',
                data: '3600'
              }, {
                label: 'm3/min',
                data: '60'
              }],
              vol_unit: [{
                label: 'Gallons',
                data: 'gl'
              }, {
                label: 'm3',
                data: 'm3'
              }],
              temp_unit: [{
                label: 'Deg F',
                data: 'f'
              }, {
                label: 'Deg C',
                data: 'c'
              }],
              energy_unit: [{
                label: 'KW-hr',
                data: 'kh'
              }, {
                label: 'BTU',
                data: 'btu'
              }, {
                label: 'KJ',
                data: 'kj'
              }]
            };
            var acc_columns = {};
            files.data.forEach(function(column) {
              var computed = (!column.computed && !column.energy && !
                column.map_col);
              if (computed && cp.columns.indexOf(column.name) < 0) {
                cp.columns.push(column.name);
              }
              // Accumulated columns
              if (column.map_col) {
                acc_columns[column.map_col] = column.name;
              }
              // Get existing columns
              if (column.computed) {
                cp.computed_columns.push({
                  cc_data: column.cc_data,
                  cc_id: column.cc_id,
                  disabled: true
                });
              }
              // Only computed volume columns
              if (column.computed && !column.energy) {
                if (cp.vol_columns.findIndexByProp(column.cc_id, 'id') <
                  0) {
                  cp.vol_columns.push({
                    id: column.cc_id,
                    name: column.name
                  });
                }
              }
            });
            angular.forEach(cp.computed_columns, function(column) {
              column.cc_data.acc_name = acc_columns[column.cc_id];
            });
            if (!cp.computed_columns.length) {
              var new_obj = {
                cc_data: {
                  column_name: []
                }
              };
              cp.computed_columns = [new_obj];
            }

            /**
             * Private function to update column list after computed column
             */
            function _update_column_list() {
              vm.file.data.forEach(function(column) {
                var computed = (!column.computed && !column.energy && !
                  column.map_col);
                if (computed && cp.columns.indexOf(column.name) < 0) {
                  cp.columns.push(column.name);
                }
                // Only computed volume columns
                if (column.computed && !column.energy) {
                  if (cp.vol_columns.findIndexByProp(column.cc_id, 'id') <
                    0) {
                    cp.vol_columns.push({
                      id: column.cc_id,
                      name: column.name
                    });
                  }
                }
              });
            }

            /**
             * Private function to calculate volume from flow rate
             * @param  {Float} col      CSV column data (Flow rate)
             * @param  {Float} interval sampling interval
             * @param  {Float} unit     flow unit
             * @return {Float} returns calculated volume
             */
            function _calculate_volume(col, interval, unit) {
              return (col * (interval / unit)) || 0;
            }

            /**
             * Private function to calculate energy from accumulated volume
             * @param  {Float} av  Accumulated volume
             * @param  {Float} dt  Delta temp (Temp OUT - Temp IN)
             * @param  {Float} cp  CP * Density
             * @param  {Float} vmp Volume multiplier
             * @param  {Float} emp Energy Multiplier
             * @return {Float} returns Energy for given params
             */
            function _calculate_energy(av, dt, cp, vmp, emp) {
              return (av * dt * cp * vmp * emp) || 0;
            }

            /**
             * Private function to get predefined constants for energy calculation
             * @param  {String} vol_unit    Unit of accumumated volume
             * @param  {String} temp_unit   Unit of temp
             * @param  {String} energy_unit Unit of energy output
             * @return {Object} constansts  Object of constanst multipliers
             */
            function _get_energy_constansts(vol_unit, temp_unit,
              energy_unit) {
              var constansts = {};
              // Volume multiplier
              if (vol_unit === 'gl') {
                constansts.vol_multi = VOL_GL_MULTI;
              } else if (vol_unit === 'm3') {
                constansts.vol_multi = VOL_M3_MULTI;
              }
              // CP*Density
              if (temp_unit === 'f') {
                constansts.cp_density = CPD_F;
              } else if (temp_unit === 'c') {
                constansts.cp_density = CPD_C;
              }
              // Energy multiplier
              switch (energy_unit) {
                case 'kh':
                  if (temp_unit === 'f') {
                    constansts.energy_multi = EN_KH_F;
                  } else if (temp_unit === 'c') {
                    constansts.energy_multi = EN_KH_C;
                  }
                  break;

                case 'btu':
                  if (temp_unit === 'f') {
                    constansts.energy_multi = EN_BU_F;
                  } else if (temp_unit === 'c') {
                    constansts.energy_multi = EN_BU_C;
                  }
                  break;

                case 'kj':
                  if (temp_unit === 'f') {
                    constansts.energy_multi = EN_KJ_F;
                  } else if (temp_unit === 'c') {
                    constansts.energy_multi = EN_KJ_C;
                  }
                  break;

                default:
                  constansts.energy_multi = 1;
                  break;
              }
              return constansts;
            }

            /**
             * Function to save computed column
             * @param  {Array} formData   Array to from fields (models)
             * @param  {Int}   $index     Index of item
             */
            cp.save_column = function(formData, $index) {
              touched = true;
              var randomID = Utility.randomString();

              if (formData.formula_id === 'acc_vol') {
                var selected_cols = [];
                files.data.forEach(function(column) {
                  // Get columns for acc volume
                  if (formData.column_name.indexOf(column.name) >
                    -1) {
                    selected_cols.push({
                      name: column.name,
                      data: column.data
                    });
                  }
                });
                var vol_col = {
                  name: formData.name,
                  computed: true,
                  cc_id: randomID,
                  cc_data: formData,
                  data: [],
                  originalName: formData.name,
                  color: Utility.randomColor()
                };
                var acc_vol_col = {
                  name: formData.acc_name,
                  map_col: randomID,
                  cc_data: formData,
                  data: [],
                  originalName: formData.acc_name,
                  color: Utility.randomColor()
                };
                var interval = (formData.interval_radio == '0') ?
                  parseFloat(formData.interval_text) :
                  parseFloat(formData.interval_radio);
                var rate_unit = parseFloat(formData.rate_unit);
                for (var i = 0; i < selected_cols[0].data.length; i++) {
                  var calc_data = selected_cols[0].data[i][1];
                  // Volume for given time interval and csv data per unit
                  if (rate_unit) {
                    calc_data = _calculate_volume(calc_data, interval,
                      rate_unit);
                  }
                  // Initiaize accumulated vol same as vol
                  var acc_calc_data = calc_data;
                  if (i) {
                    // Acc Volume from volume `acc_vol = acc_vol[i-1] + vol`
                    acc_calc_data = (calc_data + acc_vol_col.data[i - 1][1]);
                    // Round up
                    acc_calc_data = Math.round(acc_calc_data * 100) / 100;
                  }
                  vol_col.data.push([selected_cols[0].data[i][0], calc_data]);
                  acc_vol_col.data.push([selected_cols[0].data[i][0],
                    acc_calc_data
                  ]);
                }
                vm.file.data.push(vol_col);
                vm.file.data.push(acc_vol_col);
              }
              if (formData.formula_id === 'acc_energy') {
                var energy_col = {
                  name: formData.name,
                  computed: true,
                  energy: true,
                  cc_id: randomID,
                  cc_data: formData,
                  data: [],
                  originalName: formData.name,
                  color: Utility.randomColor()
                };
                var acc_energy_col = {
                  name: formData.acc_name,
                  map_col: randomID,
                  energy: true,
                  cc_data: formData,
                  data: [],
                  originalName: formData.acc_name,
                  color: Utility.randomColor()
                };
                var vol_unit = formData.vol_unit;
                var temp_unit = formData.temp_unit;
                var energy_unit = formData.energy_unit;
                var cp_density = 0;
                var vol_multi = 0;
                var energy_multi = 0;
                var computed_vol_col;
                var temp_in_col;
                var temp_out_col;
                // Get acc vol, temp column for acc energy
                files.data.forEach(function(column) {
                  if (formData.computed_vol.indexOf(column.cc_id) > -1) {
                    computed_vol_col = column;
                  }
                  if (formData.temp_in.indexOf(column.name) > -1) {
                    temp_in_col = column;
                  }
                  if (formData.temp_out.indexOf(column.name) > -1) {
                    temp_out_col = column;
                  }
                });

                // Get constants multipliers
                var constansts = _get_energy_constansts(vol_unit, temp_unit,
                  energy_unit);
                vol_multi = constansts.vol_multi;
                cp_density = constansts.cp_density;
                energy_multi = constansts.energy_multi;
                if (computed_vol_col) {
                  for (var e = 0; e < computed_vol_col.data.length; e++) {
                    var temp_in = 0;
                    var temp_out = 0;
                    var delta_temp = 0;
                    var energy_data = 0;
                    var acc_energy_data = 0;
                    var acc_vol_data = parseFloat(computed_vol_col.data[e][
                      1
                    ]);
                    if (temp_in_col.data && temp_in_col.data.length) {
                      if (temp_in_col.data[e] && temp_in_col.data[e][1]) {
                        temp_in = temp_in_col.data[e][1];
                      }
                    }
                    if (temp_out_col.data && temp_out_col.data.length) {
                      if (temp_out_col.data[e] && temp_out_col.data[e][1]) {
                        temp_out = temp_out_col.data[e][1];
                      }
                    }
                    if (temp_in || temp_out) {
                      delta_temp = parseFloat(temp_out - temp_in);
                    }
                    if (delta_temp) {
                      energy_data = _calculate_energy(acc_vol_data,
                        delta_temp, cp_density,
                        vol_multi, energy_multi);
                    } else {
                      energy_data = 0;
                    }
                    // Initiaize accumulated energy same as energy
                    acc_energy_data = energy_data;
                    if (e) {
                      // Acc Energy from energy `acc_e = acc_e[i-1] + e`
                      acc_energy_data = (energy_data + acc_energy_col.data[
                        e - 1][1]);
                      // Round up
                      acc_energy_data = Math.round(acc_energy_data * 100) /
                        100;
                    }
                    energy_col.data.push(
                      [computed_vol_col.data[e][0], energy_data]
                    );
                    acc_energy_col.data.push(
                      [computed_vol_col.data[e][0], acc_energy_data]
                    );
                  }
                }
                vm.file.data.push(energy_col);
                vm.file.data.push(acc_energy_col);
              }
              _update_column_list();
              cp.computed_columns[$index].disabled = true;
              toastr.success('Saved Successfully!');
            };

            /**
             * Function to add more rows to forms
             * @param {Array} arrName   Array in which items needs to be added
             */
            cp.addMore = function(arrName) {
              var new_obj = {
                cc_data: {
                  // formula_id: '0',
                  // name: '',
                  column_name: []
                }
              };
              // var params_count = cp.formulas[].params.length;
              // for (var i = 0; i < params_count; i++) {
              //   new_obj.cc_data.column_name.push(cp.columns[0]);
              // };
              arrName.push(new_obj);
            };

            /**
             * Function to remove item from array
             * @param  {Array}  arrName  Array from which row needs to be deleted
             * @param  {Int}    index    Index of item needs to be deleted
             * @param  {String} del_col  Column to delete
             */
            cp.deleteColumn = function(arrName, index, del_col) {
              if (window.confirm('Are you sure?')) {
                touched = true;
                var len = vm.file.data.length - 1;
                if (del_col && del_col.length) {
                  for (var i = len; i >= 0; i--) {
                    var col = vm.file.data[i];
                    if (col.cc_id === del_col || col.map_col === del_col) {
                      vm.file.data.splice(i, 1);
                    }
                  }
                }
                arrName.splice(index, 1);
                _update_column_list();
                toastr.success('Deleted Successfully!');
              }
            };

            /**
             * Function to cancel modal
             */
            $scope.cancel = function() {
              if (touched) {
                vm.arrangeAxis = true;
                vm.axis_selection();
              }
              $uibModalInstance.close();
            };
          },
          controllerAs: 'cp'
        });
      };

      /**
       * Function to provide rename label and color picker modal
       */
      vm.openRenameModal = function() {
        $uibModal.open({
          templateUrl: 'app/checklist/label_column.html',
          windowTopClass: 'modal-large',
          controller: function($scope, $uibModalInstance,
            localStorage) {
            var labelForm = this;
            labelForm.checklist_info = localStorage.get('formtype');
            labelForm.fileData = angular.copy(vm.file);
            $scope.save = function(form, data) {
              // Update original name for individual files.
              // @TODO find some better way for this.
              vm.files.forEach(function(file) {
                file.data.forEach(function(col) {
                  data.data.forEach(function(dcol) {
                    if (dcol.originalName === col.originalName) {
                      col.name = dcol.name;
                    }
                  });
                });
              });
              // Close modalbox
              $uibModalInstance.close();
              if (form.$dirty) {
                // If Computed column then update inner property too
                if (data.data && data.data.length) {
                  angular.forEach(data.data, function(col) {
                    if (col.cc_data) {
                      if (col.computed) {
                        col.cc_data.name = col.name;
                      } else {
                        col.cc_data.acc_name = col.name;
                      }
                    }
                  });
                }
                vm.file = data;
                vm.axis_selection();
              }
            };
            $scope.cancel = function() {
              $uibModalInstance.dismiss('Cancel!');
            };
          },
          controllerAs: 'labelForm'
        });
      };
    })
    .directive('fileread', [

      function() {
        return {
          scope: {
            fileread: '='
          },
          link: function(scope, element) {
            element.bind('change', function(changeEvent) {
              var file = (changeEvent.srcElement || changeEvent.target)
                .files[0];
              scope.fileread = file;
              scope.$apply();
            });
          }
        };
      }
    ]);
})(angular.module('app.checklist'));
