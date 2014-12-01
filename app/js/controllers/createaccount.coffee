angular.module("app").controller "CreateAccountController", ($scope, $location, $http, $q, $rootScope, Wallet) ->
    $scope.f = {}

    get_coupon = (code, redeem, account_name, account_key) ->
        deferred = $q.defer()
        url = "http://bitshares:3000/api/coupons/#{code}"
        params = callback: 'JSON_CALLBACK'
        if redeem
            url += "/redeem"
            params.account_name = account_name
            params.account_key = account_key
        $http.jsonp(url, params: params).success (data, status , header, config) ->
            console.log "------ coupon suceess ------>", data, status
            deferred.resolve(data.coupon)
        deferred.promise

    $scope.createAccount = ->

        form = @createaccount
        form.account_name.error_message = null
        name = $scope.f.name
        error_handler = (response) ->
            if response.data.error
                form.account_name.error_message = response.data.error.message
                return true
            else
                return false

        deferred = $q.defer()
        Wallet.create_account(name, {}, error_handler).then (account_key) ->
            get_coupon($scope.f.coupon, true, name, account_key).then (coupon) ->
                console.log "------ coupon ------>", coupon
                if coupon.status == 'ok'
                    $location.path("accounts/" + name)
                else if coupon.status == 'na'
                    $scope.f.coupon_ok = false
                    $scope.f.coupon_error = "Coupon not found"
                else if coupon.status == 'expired'
                    $scope.f.coupon_ok = false
                    $scope.f.coupon_error = "Coupon expired"
                else if coupon.status == 'redeemed'
                    $scope.f.coupon_ok = false
                    $scope.f.coupon_error = "Coupon is already redeemed"
                deferred.resolve(true)
        $rootScope.showLoadingIndicator deferred.promise

    $scope.coupon_changed = ->
        coupon = $scope.f.coupon
        unless coupon.length == 12
            $scope.f.coupon_ok = false
            $scope.f.coupon_amount = null
            return
        get_coupon(coupon, false).then (coupon) ->
            console.log "------ coupon_changed ------>", coupon
            if coupon.status == 'ok'
                $scope.f.coupon_error = null
                $scope.f.coupon_ok = true
                $scope.f.coupon_amount = coupon.amount
            else if coupon.status == 'na'
                $scope.f.coupon_ok = false
                $scope.f.coupon_error = "Coupon not found"
            else if coupon.status == 'expired'
                $scope.f.coupon_ok = false
                $scope.f.coupon_error = "Coupon expired"
            else if coupon.status == 'redeemed'
                $scope.f.coupon_ok = false
                $scope.f.coupon_error = "Coupon is already redeemed"


