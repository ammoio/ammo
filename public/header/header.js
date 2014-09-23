(function (){
    'use strict';

    angular.module('ammo.controllers.header', [])
        .controller('HeaderController', HeaderController);

    function HeaderController() {
        console.log("headercontroller");
        var Ctrl = this;
    }
})();
