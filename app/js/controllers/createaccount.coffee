angular.module("app").controller "CreateAccountController", ($scope, $location, $http, $q, $rootScope, Wallet, Blockchain, Utils) ->
    $scope.f = {}

    query_coupon = (code, redeem, account_name, account_key) ->
        deferred = $q.defer()
        url = "http://bitshares:3000/api/v1/coupons/#{code}"
        params = callback: 'JSON_CALLBACK'
        if redeem
            url += "/redeem"
            params.account_name = account_name
            params.account_key = account_key
        $http.jsonp(url, params: params)
        .success (data, status , header, config) ->
            console.log "------ coupon success ------>", data, status
            deferred.resolve(data.coupon)
        .error (data, status, headers, config) ->
            console.log "------ coupon error ------>"
            deferred.reject(false)
        deferred.promise

    update_coupon_status = (coupon) ->
        if coupon.status == 'ok'
            $scope.f.coupon_error = null
            $scope.f.coupon_ok = true
            Blockchain.get_asset(coupon.asset_id).then (asset) ->
                asset_amount = angular.extend({amount: coupon.amount}, asset)
                console.log "------ asset_amount ------>", asset_amount
                $scope.f.coupon_amount = Utils.formatAsset(asset_amount)
        else if coupon.status == 'na'
            $scope.f.coupon_ok = false
            $scope.f.coupon_error = "Coupon not found"
        else if coupon.status == 'expired'
            $scope.f.coupon_ok = false
            $scope.f.coupon_error = "Coupon expired"
        else if coupon.status == 'redeemed'
            $scope.f.coupon_ok = false
            $scope.f.coupon_error = "Coupon is already redeemed"

    $scope.createAccount = ->

        form = @createaccount
        form.account_name.error_message = null
        name = $scope.f.name

        deferred = $q.defer()

        error_handler = (response) ->
            if response.data?.error
                form.account_name.error_message = response.data.error.message
            deferred.reject(response)

        Wallet.create_account(name, {}, error_handler).then (account_key) ->
            query_coupon($scope.f.coupon, true, name, account_key).then (coupon) ->
                if coupon.status == 'ok'
                    Wallet.pendingRegistrations[name] = "pending"
                    $location.path("accounts/" + name)
                else
                    update_coupon_status(coupon)
                deferred.resolve(true)
            , (error) ->
                $scope.f.coupon_ok = false
                $scope.f.coupon_error = "Faucet Error"
                deferred.reject(false)

        $rootScope.showLoadingIndicator deferred.promise

    $scope.coupon_changed = ->
        coupon = $scope.f.coupon
        unless coupon.length == 15
            $scope.f.coupon_ok = false
            $scope.f.coupon_amount = null
            return
        query_coupon(coupon, false).then (coupon) ->
            update_coupon_status(coupon)
        , (error) ->
            $scope.f.coupon_ok = false
            $scope.f.coupon_error = "Faucet Error"


