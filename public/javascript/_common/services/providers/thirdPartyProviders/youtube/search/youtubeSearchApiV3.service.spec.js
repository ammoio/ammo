describe('youtubeSearchApiV3 Service', function () {
  var youtubeSearchApiV3,
      $httpBackend,
      songMock;

  songMock = [{
    artist: '30 Seconds to Mars',
    title: 'The Kill',
    duration: 646,
    service: 'youtube',
    serviceId: 'youtubeVideoId',
    url: 'http://youtu.be/youtubeVideoId',
    image: 'imageUrl'
  }];

  beforeEach(module('ammo.youtube.searchApiV3.service'));
  beforeEach(inject(function($injector) {
    youtubeSearchApiV3 = $injector.get('youtubeSearchApiV3');
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
          id: 'youtubeVideoId',
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
    it('Should call the youtube API and return a song object', function() {
      var response;

      youtubeSearchApiV3.search('query')
        .then(function(data) {
          response = data;
        });

      $httpBackend.flush();
      expect(response).toEqual(songMock);
    });
  });
});
