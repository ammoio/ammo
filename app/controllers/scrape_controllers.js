var http = require('http');

/* ======== Scrape Controllers ========*/

module.exports = {

  scrape: function (req, res) {
    var url = "http://www.theaudiodb.com/api/v1/json/1/search.php?s=" + req.params.artist;
    var data = '';
    http.get(url, function (response) {
      response.on('data', function (chunk) {
        data += chunk;
      });

      response.on('end', function () {
        //res.setHeader()
        res.send(data);
      });
    })
      .on('error', function (e) {
        console.log("Error Scraping Song" + e.message);
      });
  }

};