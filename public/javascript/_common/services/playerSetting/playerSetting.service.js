(function() {
  'use strict';

  angular
    .module('ammo.playerSetting.service', [
      'ammo.event.service'
    ])
    .constant('repeatOptions', ['none', 'all', 'single'])
    .factory('playerSetting', playerSettingService);

    function playerSettingService(repeatOptions, event) {
      var shuffled = false,
          repeat = repeatOptions[0],
          playerSetting = {
            isShuffled: isShuffled,
            getRepeat: getRepeat,
            toggleShuffle: toggleShuffle,
            setRepeat: setRepeat
          };

      return playerSetting;

      function isShuffled() {
        return shuffled;
      }

      function getRepeat() {
        return repeat;
      }

      function toggleShuffle() {
        shuffled = !shuffled;
        if (shuffled) {
          event.publish('setShuffle');
        } else {
          event.publish('unsetShuffle');
        }

        return shuffled;
      }

      function setRepeat() {
        var currentRepeatIndex = _.indexOf(repeat);

        repeatOptions = currentRepeatIndex === repeatOptions.length - 1 ? repeatOptions[0] : repeatOptions[currentRepeatIndex + 1];
        return repeatOptions;
      }
    }
})();
