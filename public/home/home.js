(function (){
    'use strict';

    angular.module('ammo.controllers.home', [
        'ui.router'
    ])
        .config(HomeConfig)
        .controller('HomeController', HomeController);

    function HomeConfig($stateProvider) {
        $stateProvider
            .state('ammo.player.home', {
                url: '',
                views:{
                    'sidebar': {
                        templateUrl: 'sidebar/sidebar.tpl.html',
                        controller: 'SidebarController as SidebarController'
                    },
                    'main': {
                        templateUrl: 'home/home.tpl.html',
                        controller: 'HomeController as HomeController'
                    },
                    'player': {
                        templateUrl: 'player/player.tpl.html',
                        controller: 'PlayerController as PlayerController'
                    }
                }
            });
    }

    function HomeController() {
        var Ctrl = this;
    }
})();
