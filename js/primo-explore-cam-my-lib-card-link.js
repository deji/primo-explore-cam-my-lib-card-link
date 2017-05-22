app.controller('PrmMainMenuAfterController', ['$http', '$location', '$mdDialog', '$scope', '$rootScope', '$state', '$interval', '$window', function ($http, $location, $mdDialog, $rootScope, $scope, $state, $interval, $window) {
    var vm = this;

    var mainMenuLinks = [];
    function setMainMenuLinks() {}
    var unregister = $scope.$watch(function () {
        var mainMenus = document.getElementsByTagName('prm-main-menu');
        var a;
        if (mainMenus.length === 1) {
            a = mainMenus[0] && mainMenus[0].children && mainMenus[0].children[0] && mainMenus[0].children[0].children &&
                mainMenus[0].children[0].children[0].children;
        } else if (mainMenus.length === 2) {
            a = mainMenus[1].getElementsByTagName('md-card');
        }
        if (a && a.length) {
            mainMenuLinks = a;
            return a.length;
        } else {
            mainMenuLinks = [];
            return 0;
        }
    }, function (res) {
        var links = mainMenuLinks;
        if (links.length > 0) {
            // with Primo May 2017 release, out My Library Account menu item is now in third position
            angular.element(links[2]).unbind('click').bind("click", myAccountLink);
        }
    });

    var myAccountLink = function myAccountLink() {
        //window.open('http://www.lib.cam.ac.uk/library_widget/library_widget_login.cgi', '_blank');
        var parentEl = angular.element(document.body);

        var currentState = $state.current;
        currentState.reloadOnSearch = true;

        var userAgent = $window.navigator.userAgent;
        var isFirefox = /firefox/i.test(userAgent);
        if (isFirefox) {
            window.location = window.location + '&widgetUrl=' + encodeURIComponent("http://www.lib.cam.ac.uk/library_widget/library_widget_login.cgi");
        } else {
            $location.search('widgetUrl', "http://www.lib.cam.ac.uk/library_widget/library_widget_login.cgi");

            var widgetUrlSet = false;
            var intervalPromise = $interval(function () {

                if (widgetUrlSet) {
                    $mdDialog.show({
                        parent: parentEl,
                        /**/

                        template: '<md-dialog  style="width:100%;padding:2em;max-width:500px;" aria-label="List dialog">' + '  <md-dialog-content>' + '   <iframe flex style="border-width:0px;width:100%;min-height:500px" src="http://www.lib.cam.ac.uk/library_widget/library_widget_login.cgi"></iframe>' + '  </md-dialog-content>' + '  <md-dialog-actions>' + '<div flex layout="row" layout-align="center center">' + '       <md-button ng-click="closeDialog()" class="md-primary">' + '       {{"nui.locations.items.widget.close" | translate}}' + '       </md-button>' + '    </div>' + '</md-dialog-actions>' + '</md-dialog>',

                        controller: DialogController
                    }).then(function () {
                        $location.search('widgetUrl', null);
                    });
                    $interval.cancel(intervalPromise);
                }
                if (window.location.search.includes('widgetUrl')) {
                    widgetUrlSet = true;
                }
            }, 10);
        }

        function DialogController($scope, $mdDialog) {

            $scope.closeDialog = function () {
                $mdDialog.hide();
            };
        }
    };

    vm.getLink = function () {
        return vm.opacLink;
    };
}]);

app.component('prmMainMenuAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'PrmMainMenuAfterController',
    template: '<div ></div>'
});
