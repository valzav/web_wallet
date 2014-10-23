angular.module("app").controller "ToolbarController", ($scope, $rootScope, Shared, Wallet, Auth) ->

    $scope.back = ->
        $scope.history_back()

    $scope.forward = ->
        $scope.history_forward()

    $scope.open_context_help = ->
        $scope.context_help.open = true

    errors = $scope.errors = Shared.errors

    $scope.error_notifier_toggled = (open) ->
        if open
            e.details = null for e in errors.list
        else
            errors.new_error = false

    Auth.currentUser().then (user) ->
        console.log "------ currentUser ------>", user

    $scope.logout = ->
        Auth.logout().then ->
            console.log "------ logged out ------"
            window.location.href = "/users/sign_up"


