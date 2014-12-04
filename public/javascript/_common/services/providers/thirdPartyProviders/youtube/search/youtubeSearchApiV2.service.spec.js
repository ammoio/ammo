describe('youtubeSearchApiV2 Service', function () {
  var youtubeSearchApiV2,
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

  beforeEach(module('ammo.youtube.searchApiV2.service'));
  beforeEach(inject(function($injector) {
    youtubeSearchApiV2 = $injector.get('youtubeSearchApiV2');
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', /http:\/\/gdata.youtube.com\/feeds\/api\/videos/)
      .respond({
        data: {
          items: [{
            title: '30 Seconds to Mars - The Kill',
            duration: 646,
            id: 'youtubeVideoId',
            thumbnail: {
              hqDefault: 'imageUrl'
            }
          }]
        }
      });
  }));

  describe('Test  YouTube search', function() {
    it('Should call the youtube API and return a song object', function() {
      var response;

      youtubeSearchApiV2.search('query')
        .then(function(data) {
          response = data;
        });

      $httpBackend.flush();
      expect(response).toEqual(songMock);
    });
  });
});
