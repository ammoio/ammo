describe('currentPlaylist Service', function () {
  var mockPlaylist,
      currentPlaylist,
      playerSettings;

  beforeEach(module('ammo.currentPlaylist.service'));
  beforeEach(inject(function($injector) {
    currentPlaylist = $injector.get('currentPlaylist');
    playerSettings = $injector.get('playerSettings');

    mockPlaylist = {
      songs: ['song1', 'song2', 'song3', 'song4', 'song5']
    };
  }));

  describe('setPlaylist function', function() {
    it('should set and return the unshuffled playlist as current playlist when not shuffled', function () {
      var newCurrentPlaylist = currentPlaylist.setPlaylist(mockPlaylist);

      expect(newCurrentPlaylist).toBe(mockPlaylist);
    });

    it('should call the setShuffle function when getShuffled is set to true', function () {
      spyOn(currentPlaylist, 'shuffle');

      playerSettings.setShuffle(true); // set to true
      currentPlaylist.setPlaylist(mockPlaylist);

      expect(currentPlaylist.shuffle).toHaveBeenCalledWith(true);
    });
  });
});
