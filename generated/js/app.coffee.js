(function() {
  var app;

  app = angular.module("app", ["ngResource", "ui.router", "ui.bootstrap", "app.services", "app.directives", "ngGrid", "ui.bootstrap"]);

  app.config(function($stateProvider, $urlRouterProvider) {
    var account, blocks, contact, contacts, createwallet, home, receive, transactions, transfer;
    $urlRouterProvider.otherwise('/home');
    home = {
      name: 'home',
      url: '/home',
      templateUrl: "home.html",
      controller: "HomeController"
    };
    receive = {
      name: 'receive',
      url: '/receive',
      templateUrl: "receive.html",
      controller: "ReceiveController"
    };
    transfer = {
      name: 'transfer',
      url: '/transfer',
      templateUrl: "transfer.html",
      controller: "TransferController"
    };
    contacts = {
      name: 'contacts',
      url: '/contacts',
      templateUrl: "contacts.html",
      controller: "ContactsController"
    };
    contact = {
      name: 'contact',
      url: '/contact',
      templateUrl: "contact.html",
      controller: "ContactController"
    };
    account = {
      name: 'account',
      url: '/account',
      templateUrl: "account.html",
      controller: "AccountController"
    };
    transactions = {
      name: 'transactions',
      url: '/transactions',
      templateUrl: "transactions.html",
      controller: "TransactionsController"
    };
    blocks = {
      name: 'blocks',
      url: '/blocks',
      templateUrl: "blocks.html",
      controller: "BlocksController"
    };
    createwallet = {
      name: 'createwallet',
      url: '/createwallet',
      templateUrl: "createwallet.html",
      controller: "CreateWalletController"
    };
    return $stateProvider.state(home).state(receive).state(transfer).state(contacts).state(transactions).state(blocks).state(createwallet).state(contact).state(account);
  });

}).call(this);

(function() {
  angular.module("app").controller("AccountController", function($scope, $location, Shared, RpcService) {
    var getbalance;
    $scope.accountName = Shared.accountName;
    $scope.accountAddress = Shared.accountAddress;
    getbalance = function() {
      return RpcService.request('wallet_get_balance', ["XTS", $scope.accountName]).then(function(response) {
        $scope.accountBalance = response.result[0][0];
        return $scope.accountUnit = response.result[0][1];
      });
    };
    return getbalance();
  });

}).call(this);

(function() {
  angular.module("app").controller("BlocksController", function($scope, $location) {});

}).call(this);

(function() {
  angular.module("app").controller("ContactController", function($scope, $location, Shared) {
    $scope.contactName = Shared.contactName;
    return $scope.contactAddress = Shared.contactAddress;
  });

}).call(this);

(function() {
  angular.module("app").controller("ContactsController", function($scope, $state, $location, $modal, $q, $http, $rootScope, RpcService, Shared) {
    $scope.myData = [];
    $scope.filterOptions = {
      filterText: ""
    };
    $scope.gridOptions = {
      enableRowSelection: false,
      enableCellSelection: false,
      enableCellEdit: false,
      data: "myData",
      filterOptions: $scope.filterOptions,
      rowHeight: 68,
      columnDefs: [
        {
          field: "Label",
          enableCellEdit: false,
          displayName: "Name",
          cellTemplate: '<a ui-sref="contact" ng-click="contactClicked(row)" class="btn btn-default btn-sm active" style="width:100%; opacity:0.7; text-align:left"><div><div style="font-size: 200%">{{row.entity[col.field].name}}</div><div style="font-family:monospace">{{row.entity[col.field].owner_key}}</div></div></a>'
        }, {
          displayName: "",
          enableCellEdit: false,
          width: 200,
          cellTemplate: "<div class='text-center' style='margin-top:10px'><button title='Copy' class='btn btn-xs btn-link' ng-click='sendHimFunds(row)'><i class='fa fa-3x fa-sign-in fa-fw'></i></button><button title='Send' class='btn btn-xs btn-link'><i class='fa fa-3x fa-copy fa-fw'></i></button><button title='Delete' class='btn btn-xs btn-link'><i style='color:#d14' class='fa fa-lg fa-times fa-fw'></i></button></div>",
          headerCellTemplate: "<div class='text-center' style='background:none; margin-top:2px'><i class='fa fa-gear fa-fw fa-2x'></i></div>"
        }
      ]
    };
    $scope.filterNephi = function() {
      var filterText;
      filterText = "name:Nephi";
      if ($scope.filterOptions.filterText === "") {
        $scope.filterOptions.filterText = filterText;
      } else {
        if ($scope.filterOptions.filterText === filterText) {
          $scope.filterOptions.filterText = "";
        }
      }
    };
    $scope.refresh_addresses = function() {
      return RpcService.request("wallet_list_contact_accounts").then(function(response) {
        var data, i, newData;
        newData = [];
        data = response.result;
        i = 0;
        while (i < data.length) {
          newData.push({
            Label: data[i]
          });
          i++;
        }
        return $scope.myData = newData;
      });
    };
    $scope.refresh_addresses();
    $scope.sendHimFunds = function(contact) {
      Shared.contactName = contact.entity.Label.name;
      return $state.go("transfer");
    };
    $scope.contactClicked = function(contact) {
      Shared.contactName = contact.entity.Label.name;
      return Shared.contactAddress = contact.entity.Label.owner_key;
    };
    return $scope.newContactModal = function() {
      return $modal.open({
        templateUrl: "newcontact.html",
        controller: "NewContactController",
        resolve: {
          refresh: function() {
            return $scope.refresh_addresses;
          }
        }
      });
    };
  });

}).call(this);

(function() {
  angular.module("app").controller("CreateWalletController", function($scope, $modal, $log, RpcService, Wallet) {
    $scope.wallet_name = "default";
    return $scope.submitForm = function(isValid) {
      if (isValid) {
        return Wallet.create($scope.wallet_name, $scope.spending_password).then(function() {
          window.location.href = "/";
        });
      } else {
        alert("Please properly fill up the form below");
      }
    };
  });

  /*  What is this?  Delete?
  {"id": 1, "result": [
    {"block_num": 574, "trx_num": 0, "trx_id": "c221246182bd73cb80a76d2749eeb6bdd6f50acb", "created_time": 0, "received_time": 1401732930, "amount": {"amount": 10000000, "asset_id": 0}, "fees": 0, "to_account": "", "from_account": "XTS8JkhkfPQSxPd7VUiqdDDx9SiPALrbrUFyptFbCMHoAYaLSicPy", "memo_message": "Some millions       "}
  ]}
  
  
  {"id": 1, "result": [
    {"block_num": 574, "trx_num": 0, "trx_id": "c221246182bd73cb80a76d2749eeb6bdd6f50acb", "created_time": 0, "received_time": 1401732930, "amount": {"amount": 10000000, "asset_id": 0}, "fees": 0, "to_account": "", "from_account": "XTS8JkhkfPQSxPd7VUiqdDDx9SiPALrbrUFyptFbCMHoAYaLSicPy", "memo_message": "Some millions"}
  ]}
  */


}).call(this);

(function() {
  angular.module("app").controller("FooterController", function($scope, Wallet) {
    var on_update, watch_for;
    $scope.connections = 0;
    $scope.blockchain_blocks_behind = 0;
    $scope.blockchain_status = "off";
    $scope.blockchain_last_block_num = 0;
    watch_for = function() {
      return Wallet.info;
    };
    on_update = function(info) {
      var connections, hours_diff, hours_diff_str, minutes_diff, minutes_diff_str, seconds_diff;
      connections = info.network_connections;
      $scope.connections = connections;
      if (connections === 0) {
        $scope.connections_str = "Not connected to the network";
      } else if (connections === 1) {
        $scope.connections_str = "1 network connection";
      } else {
        $scope.connections_str = "" + connections + " network connections";
      }
      if (connections < 4) {
        $scope.connections_img = "/img/signal_" + connections + ".png";
      } else {
        $scope.connections_img = "/img/signal_4.png";
      }
      $scope.wallet_unlocked = info.wallet_unlocked;
      if (info.last_block_time) {
        seconds_diff = (Date.now() - info.last_block_time.getTime()) / 1000;
        hours_diff = Math.floor(seconds_diff / 3600);
        minutes_diff = (Math.floor(seconds_diff / 60)) % 60;
        hours_diff_str = hours_diff === 1 ? "" + hours_diff + " hour" : "" + hours_diff + " hours";
        minutes_diff_str = minutes_diff === 1 ? "" + minutes_diff + " minute" : "" + minutes_diff + " minutes";
        $scope.blockchain_blocks_behind = Math.floor(seconds_diff / 30);
        $scope.blockchain_time_behind = "" + hours_diff_str + " " + minutes_diff_str;
        $scope.blockchain_status = $scope.blockchain_blocks_behind < 2 ? "synced" : "syncing";
        return $scope.blockchain_last_block_num = info.last_block_num;
      } else {
        return $scope.blockchain_status = "off";
      }
    };
    return $scope.$watch(watch_for, on_update, true);
  });

}).call(this);

(function() {
  angular.module("app").controller("HomeController", function($scope, $modal, $log, RpcService, Wallet, Growl) {
    var on_update, watch_for;
    $scope.transactions = [];
    $scope.balance_amount = 0.0;
    $scope.balance_asset_type = '';
    watch_for = function() {
      return Wallet.info;
    };
    on_update = function(info) {
      if (info.wallet_open) {
        return $scope.balance_amount = info.balance;
      }
    };
    $scope.$watch(watch_for, on_update, true);
    return Wallet.get_balance().then(function(balance) {
      $scope.balance_amount = balance.amount;
      $scope.balance_asset_type = balance.asset_type;
      return Wallet.get_transactions().then(function(trs) {
        return $scope.transactions = trs;
      });
    });
  });

}).call(this);

(function() {
  angular.module("app").controller("NewContactController", function($scope, $modalInstance, RpcService, refresh) {
    $scope.cancel = function() {
      return $modalInstance.dismiss("cancel");
    };
    return $scope.ok = function() {
      return RpcService.request('wallet_add_contact_account', [$scope.name, $scope.address]).then(function(response) {
        $modalInstance.close("ok");
        return refresh();
      });
    };
  });

}).call(this);

(function() {
  angular.module("app").controller("OpenWalletController", function($scope, $modalInstance, RpcService, mode) {
    var open_wallet_request, unlock_wallet_request;
    console.log("OpenWalletController mode: " + mode);
    if (mode === "open_wallet") {
      $scope.title = "Open Wallet";
      $scope.password_label = "Wallet Password";
      $scope.wrong_password_msg = "Wallet cannot be opened. Please check you password";
    } else if (mode === "unlock_wallet") {
      $scope.title = "Unlock Wallet";
      $scope.password_label = "Spending Password";
      $scope.wrong_password_msg = "Wallet cannot be unlocked. Please check you password";
    }
    open_wallet_request = function() {
      return RpcService.request('wallet_open', ['default', $scope.password]).then(function(response) {
        $modalInstance.close("ok");
        return $scope.cur_deferred.resolve();
      }, function(reason) {
        $scope.password_validation_error();
        return $scope.cur_deferred.reject(reason);
      });
    };
    unlock_wallet_request = function() {
      return RpcService.request('wallet_unlock', [1000000, $scope.password]).then(function(response) {
        $modalInstance.close("ok");
        return $scope.cur_deferred.resolve();
      }, function(reason) {
        $scope.password_validation_error();
        return $scope.cur_deferred.reject(reason);
      });
    };
    $scope.has_error = false;
    $scope.ok = function() {
      if (mode === "open_wallet") {
        return open_wallet_request();
      } else {
        return unlock_wallet_request();
      }
    };
    $scope.password_validation_error = function() {
      $scope.password = "";
      return $scope.has_error = true;
    };
    $scope.cancel = function() {
      return $modalInstance.dismiss("cancel");
    };
    return $scope.$watch("password", function(newValue, oldValue) {
      if (newValue !== "") {
        return $scope.has_error = false;
      }
    });
  });

}).call(this);

(function() {
  angular.module("app").controller("ReceiveController", function($scope, $location, RpcService, Shared, Growl) {
    var refresh_addresses;
    $scope.new_address_label = "";
    $scope.addresses = [];
    $scope.pk_label = "";
    $scope.pk_value = "";
    $scope.wallet_file = "";
    $scope.wallet_password = "";
    $scope.accountClicked = function(name, address) {
      Shared.accountName = name;
      return Shared.accountAddress = address;
    };
    refresh_addresses = function() {
      return RpcService.request('wallet_list_receive_accounts').then(function(response) {
        $scope.addresses.splice(0, $scope.addresses.length);
        return angular.forEach(response.result, function(val) {
          return $scope.addresses.push({
            label: val.name,
            address: val.owner_key
          });
        });
      });
    };
    refresh_addresses();
    $scope.create_address = function() {
      return RpcService.request('wallet_create_account', [$scope.new_address_label]).then(function(response) {
        $scope.new_address_label = "";
        return refresh_addresses();
      });
    };
    $scope.import_key = function() {
      return RpcService.request('wallet_import_private_key', [$scope.pk_value, $scope.pk_label]).then(function(response) {
        $scope.pk_value = "";
        $scope.pk_label = "";
        Growl.notice("", "Your private key was successfully imported.");
        return refresh_addresses();
      });
    };
    return $scope.import_wallet = function() {
      return RpcService.request('wallet_import_bitcoin', [$scope.wallet_file, $scope.wallet_password]).then(function(response) {
        $scope.wallet_file = "";
        $scope.wallet_password = "";
        Growl.notice("The wallet was successfully imported.");
        return refresh_addresses();
      });
    };
  });

}).call(this);

(function() {
  angular.module("app").controller("RootController", function($scope, $location, $modal, $q, $http, $rootScope, Wallet) {
    var open_wallet;
    Wallet.open();
    open_wallet = function(mode) {
      $rootScope.cur_deferred = $q.defer();
      $modal.open({
        templateUrl: "openwallet.html",
        controller: "OpenWalletController",
        resolve: {
          mode: function() {
            return mode;
          }
        }
      });
      return $rootScope.cur_deferred.promise;
    };
    $rootScope.open_wallet_and_repeat_request = function(mode, request_data) {
      var deferred_request;
      deferred_request = $q.defer();
      open_wallet(mode).then(function() {
        return $http({
          method: "POST",
          cache: false,
          url: '/rpc',
          data: request_data
        }).success(function(data, status, headers, config) {
          return deferred_request.resolve(data);
        }).error(function(data, status, headers, config) {
          return deferred_request.reject();
        });
      });
      return deferred_request.promise;
    };
    return $scope.wallet_action = function(mode) {
      return open_wallet(mode);
    };
  });

}).call(this);

(function() {
  angular.module("app").controller("TransactionsController", function($scope, $location, RpcService, Wallet) {
    $scope.transactions = [];
    Wallet.get_transactions().then(function(trs) {
      return $scope.transactions = trs;
    });
    return $scope.rescan = function() {
      return $scope.load_transactions();
    };
  });

}).call(this);

(function() {
  angular.module("app").controller("TransferController", function($scope, $location, $state, RpcService, Growl, Shared) {
    $scope.payto = Shared.contactName;
    return $scope.send = function() {
      return RpcService.request('wallet_transfer', [$scope.amount, $scope.symbol, $scope.payfrom, $scope.payto, $scope.memo]).then(function(response) {
        $scope.payto = "";
        $scope.amount = "";
        $scope.memo = "";
        return Growl.notice("", "Transaction broadcasted (" + response.result + ")");
      });
    };
  });

}).call(this);

(function() {
  angular.module("app.directives", []).directive("errorBar", function($parse) {
    return {
      restrict: "A",
      template: "<div class=\"alert alert-danger\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\" ng-click=\"hideErrorBar()\" >×</button>\n  <i class=\"fa fa-exclamation-circle\"></i>\n  {{errorMessage}}\n </div> ",
      link: function(scope, elem, attrs) {
        var errorMessageAttr;
        errorMessageAttr = attrs["errormessage"];
        scope.errorMessage = null;
        scope.$watch(errorMessageAttr, function(newVal) {
          scope.errorMessage = newVal;
          return scope.isErrorBarHidden = !newVal;
        });
        return scope.hideErrorBar = function() {
          scope.errorMessage = null;
          $parse(errorMessageAttr).assign(scope, null);
          return scope.isErrorBarHidden = true;
        };
      }
    };
  });

  angular.module("app.directives").directive("infoBar", function($parse) {
    return {
      restrict: "A",
      template: "<div class=\"alert alert-success\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\" ng-click=\"hideInfoBar()\" >×</button>\n  <i class=\"fa fa-check-circle\"></i>\n  {{infoMessage}}\n </div> ",
      link: function(scope, elem, attrs) {
        var infoMessageAttr;
        infoMessageAttr = attrs["infomessage"];
        scope.infoMessage = null;
        scope.$watch(infoMessageAttr, function(newVal) {
          scope.infoMessage = newVal;
          return scope.isInfoBarHidden = !newVal;
        });
        return scope.hideInfoBar = function() {
          scope.infoMessage = null;
          $parse(infoMessageAttr).assign(scope, null);
          return scope.isInfoBarHidden = true;
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module("app.directives").directive("focusMe", function($timeout) {
    return {
      scope: {
        trigger: "@focusMe"
      },
      link: function(scope, element) {
        return scope.$watch("trigger", function() {
          return $timeout(function() {
            return element[0].focus();
          });
        });
      }
    };
  });

  angular.module("app.directives").directive("match", function() {
    return {
      require: "ngModel",
      restrict: "A",
      scope: {
        match: "="
      },
      link: function(scope, elem, attrs, ctrl) {
        return scope.$watch((function() {
          return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
        }), function(currentValue) {
          return ctrl.$setValidity("match", currentValue);
        });
      }
    };
  });

}).call(this);

(function() {
  var servicesModule;

  servicesModule = angular.module("app.services", []);

  servicesModule.config(function($httpProvider) {
    return $httpProvider.interceptors.push('myHttpInterceptor');
  });

  servicesModule.factory("myHttpInterceptor", function($q, $rootScope, Growl) {
    var dont_report_methods;
    dont_report_methods = ["open_wallet", "walletpassphrase", "get_info", "blockchain_get_block_by_number"];
    return {
      responseError: function(response) {
        var error_msg, method, method_in_dont_report_list, promise, _ref, _ref1, _ref2;
        promise = null;
        method = null;
        error_msg = ((_ref = response.data) != null ? (_ref1 = _ref.error) != null ? _ref1.message : void 0 : void 0) != null ? response.data.error.message : response.data;
        if ((response.config != null) && response.config.url.match(/\/rpc$/)) {
          if (error_msg.match(/Unable to open wallet/)) {
            location.href = "blank.html#/createwallet";
          }
          if (error_msg.match(/is_open\(\)\:/)) {
            promise = $rootScope.open_wallet_and_repeat_request("open_wallet", response.config.data);
          }
          if (error_msg.match(/The wallet's spending key must be unlocked before executing this command/)) {
            promise = $rootScope.open_wallet_and_repeat_request("unlock_wallet", response.config.data);
          }
          method = (_ref2 = response.config.data) != null ? _ref2.method : void 0;
          error_msg = method ? "In method '" + method + "': " + error_msg : error_msg;
        } else if (response.message) {
          error_msg = response.message;
        }
        console.log("" + (error_msg.substring(0, 512)) + " (" + response.status + ")", response);
        method_in_dont_report_list = method && (dont_report_methods.filter(function(x) {
          return x === method;
        })).length > 0;
        if (!promise && !method_in_dont_report_list) {
          Growl.error("RPC Server Error", "" + (error_msg.substring(0, 512)) + " (" + response.status + ")");
        }
        return (promise ? promise : $q.reject(response));
      }
    };
  });

}).call(this);

(function() {
  var servicesModule;

  servicesModule = angular.module("app.services");

  servicesModule.factory("Growl", function() {
    return {
      error: function(title, message) {
        return jQuery.growl.error({
          title: title,
          message: message
        });
      },
      notice: function(title, message) {
        return jQuery.growl.notice({
          title: title,
          message: message
        });
      },
      warning: function(title, message) {
        return jQuery.growl.warning({
          title: title,
          message: message
        });
      }
    };
  });

}).call(this);

(function() {
  var servicesModule;

  servicesModule = angular.module("app.services");

  servicesModule.factory("RpcService", function($http) {
    var RpcService;
    return RpcService = {
      request: function(method, params) {
        var http_params, reqparams;
        reqparams = {
          method: method,
          params: params || []
        };
        http_params = {
          method: "POST",
          cache: false,
          url: '/rpc',
          data: {
            jsonrpc: "2.0",
            id: 1
          }
        };
        angular.extend(http_params.data, reqparams);
        return $http(http_params).then(function(response) {
          return response.data || response;
        });
      }
    };
  });

}).call(this);

(function() {
  var servicesModule;

  servicesModule = angular.module("app.services");

  servicesModule.factory("Shared", function() {
    return {
      contactName: null
    };
  });

}).call(this);

(function() {
  var Wallet,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Wallet = (function() {
    function Wallet(q, log, rpc, interval) {
      this.q = q;
      this.log = log;
      this.rpc = rpc;
      this.interval = interval;
      this.get_transactions = __bind(this.get_transactions, this);
      this.watch_for_updates = __bind(this.watch_for_updates, this);
      this.log.info("---- Wallet Constructor ----");
      this.wallet_name = "";
      this.info = {
        network_connections: 0,
        balance: 0,
        wallet_open: false,
        last_block_num: 0,
        last_block_time: null
      };
      this.watch_for_updates();
    }

    Wallet.prototype.toDate = function(t) {
      var dateRE, i, match, nums;
      dateRE = /(\d\d\d\d)(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)/;
      match = t.match(dateRE);
      if (!match) {
        return 0;
      }
      nums = [];
      i = 1;
      while (i < match.length) {
        nums.push(parseInt(match[i], 10));
        i++;
      }
      return new Date(Date.UTC(nums[0], nums[1] - 1, nums[2], nums[3], nums[4], nums[5]));
    };

    Wallet.prototype.create = function(wallet_name, spending_password) {
      var _this = this;
      return this.rpc.request('wallet_create', [wallet_name, spending_password]).then(function(response) {});
    };

    Wallet.prototype.get_balance = function() {
      return this.rpc.request('wallet_get_balance').then(function(response) {
        var asset;
        asset = response.result[0];
        return {
          amount: asset[0],
          asset_type: asset[1]
        };
      });
    };

    Wallet.prototype.get_wallet_name = function() {
      var _this = this;
      return this.rpc.request('wallet_get_name').then(function(response) {
        console.log("---- current wallet name: ", response.result);
        return _this.wallet_name = response.result;
      });
    };

    Wallet.prototype.get_info = function() {
      return this.rpc.request('get_info').then(function(response) {
        return response.result;
      });
    };

    Wallet.prototype.open = function() {
      return this.rpc.request('wallet_open', ['default']).then(function(response) {
        return response.result;
      });
    };

    Wallet.prototype.get_block = function(block_num) {
      return this.rpc.request('blockchain_get_block_by_number', [block_num]).then(function(response) {
        return response.result;
      });
    };

    Wallet.prototype.watch_for_updates = function() {
      var _this = this;
      return this.interval((function() {
        return _this.get_info().then(function(data) {
          if (data.blockchain_head_block_num > 0) {
            return _this.get_block(data.blockchain_head_block_num).then(function(block) {
              _this.info.network_connections = data.network_num_connections;
              _this.info.balance = data.wallet_balance[0][0];
              _this.info.wallet_open = data.wallet_open;
              _this.info.wallet_unlocked = !!data.wallet_unlocked_until;
              _this.info.last_block_time = _this.toDate(block.timestamp);
              return _this.info.last_block_num = data.blockchain_head_block_num;
            });
          }
        }, function() {
          _this.info.network_connections = 0;
          _this.info.balance = 0;
          _this.info.wallet_open = false;
          _this.info.wallet_unlocked = false;
          _this.info.last_block_time = null;
          return _this.info.last_block_num = 0;
        });
      }), 2500);
    };

    Wallet.prototype.get_transactions = function() {
      var _this = this;
      return this.rpc.request("wallet_account_transaction_history").then(function(response) {
        var transactions;
        console.log("--- transactions = ", response.result);
        transactions = [];
        angular.forEach(response.result, function(val, key) {
          return transactions.push({
            block_num: val.block_num + "." + val.trx_num,
            trx_num: Number(key) + 1,
            time: val.received_time,
            amount: val.amount.amount,
            from: val.from_account,
            to: val.to_account,
            memo: val.memo_message,
            id: val.trx_id,
            fee: val.fees,
            vote: "N/A"
          });
        });
        return transactions;
      });
    };

    return Wallet;

  })();

  angular.module("app").service("Wallet", ["$q", "$log", "RpcService", "$interval", Wallet]);

}).call(this);
