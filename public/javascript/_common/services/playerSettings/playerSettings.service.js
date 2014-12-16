(function() {
  'use strict';

  angular
    .module('ammo.playerSettings.service', [
      'ammo.event.service'
    ])
    .constant('repeatOptions', ['none', 'all', 'single'])
    .factory('playerSettings', playerSettingsService);

    function playerSettingsService(repeatOptions, event) {
      var shuffled = false,
          repeat = repeatOptions[0],
          playerSetting = {
            getShuffled: getShuffled,
            getRepeat: getRepeat,
            setShuffle: setShuffle,
            setRepeat: setRepeat
          };

      return playerSetting;

      function getShuffled() {
        return shuffled;
      }

      function getRepeat() {
        return repeat;
      }

      function setShuffle(doShuffle) {
        if (_.isUndefined(doShuffle) || typeof doShuffle !== 'boolean') {
          shuffled = !shuffled;
        } else {
          shuffled = doShuffle;
        }

        if (shuffled) {
          event.publish('shuffle', true);
        } else {
          event.publish('shuffle', false);
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
