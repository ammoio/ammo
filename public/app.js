(function() {
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

    function config($stateProvider) {
        $stateProvider
            .state('ammo', {
                abstract: true,
                views: {
                    'header': {
                        templateUrl: 'header/header.tpl.html',
                        controller: 'HeaderController as HeaderController'
                    },
                    '': {
                        template: '<div ui-view></div>'
                    }
                }
            })
            .state('ammo.player', {
                abstract: true,
                templateUrl: 'app.player.tpl.html'
            });
    }
})();
