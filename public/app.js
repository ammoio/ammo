(function (){
    'use strict';

    angular.module('ammo', [
        'ui.router',
        'ammo.templates',
        'ammo.controllers.header',
        'ammo.controllers.sidebar',
        'ammo.controllers.home',
        'ammo.controllers.player'
    ])
        .config(config);

    function config($stateProvider){
        $stateProvider
            .state('ammo',{
                url: '',
                views: {
                    'header': {
                        templateUrl: 'header/header.tpl.html',
                        controller: 'HeaderController as HeaderController'
                    },
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
})();
