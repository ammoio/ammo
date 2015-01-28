describe('youtubeSearch Service', function () {
  var mockV2,
      mockV3,
      youtubeSearch;

  beforeEach(module('ammo.youtube.search.service'));
  beforeEach(module(function($provide) {
    mockV2 = { search: jasmine.createSpy() };
    mockV3 = { search: jasmine.createSpy() };

    $provide.value('youtubeSearchApiV2', mockV2);
    $provide.value('youtubeSearchApiV3', mockV3);
  }));

  beforeEach(inject(function($injector) {
    youtubeSearch = $injector.get('youtubeSearch');
  }));

  describe('API Version', function() {
    it('should call API v3 by default', function() {
      youtubeSearch.search('query');

      expect(mockV3.search).toHaveBeenCalled();
      expect(mockV2.search).not.toHaveBeenCalled();
    });

    it('should call API v2 if specified', function() {
      youtubeSearch.search('query', 5, 2);

      expect(mockV3.search).not.toHaveBeenCalled();
      expect(mockV2.search).toHaveBeenCalled();
    });
  });

  describe('Limits', function() {
    it('should default to 5 if not specified', function() {
      youtubeSearch.search('query');

      expect(mockV3.search).toHaveBeenCalledWith('query', 5);
    });

    it('should be called with a specified limit', function() {
      youtubeSearch.search('query', 10);

      expect(mockV3.search).toHaveBeenCalledWith('query', 10);
    });
  });
});
