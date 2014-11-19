describe('youtubeSearch Service', function () {
  var youtubeSearchService,
      $httpBackend,
      songMock;

  songMock = [{
    artist: '30 Seconds to Mars',
    title: 'The Kill',
    duration: 646,
    service: 'youtube',
    serviceId: 'youtubeVideoID',
    url: 'http://youtu.be/youtubeVideoID',
    image: 'imageUrl'
  }];

  beforeEach(module('ammo.youtube.search.service'));
  beforeEach(inject(function($injector) {
    youtubeSearchService = $injector.get('youtubeSearch');
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', /https:\/\/www.googleapis.com\/youtube\/v3\/search/)
      .respond({
        items: [{
          id: 'videoId'
        }]
      });

    $httpBackend.when('GET', /https:\/\/www.googleapis.com\/youtube\/v3\/videos/)
      .respond({
        items: [{
          id: 'youtubeVideoID',
          snippet: {
            title: '30 Seconds to Mars - The Kill',
            thumbnails: {
              high: {
                url: 'imageUrl'
              }
            }
          },
          contentDetails: {
            duration: 'PT10M46S'
          }
        }]
      });
  }));

  describe('Test  YouTube search', function() {
    it('Should call the youtube API and return a song object', function () {
      var response;

      youtubeSearchService.search('query')
        .then(function(data) {
          response = data;
        });

      $httpBackend.flush();
      expect(response).toEqual(songMock);
    });
  });
});
