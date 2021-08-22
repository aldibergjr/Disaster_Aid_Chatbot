var AWS = require('aws-sdk');

var region = 'us-east-2'; // e.g. us-west-1
var domain = 'search-pln-chatbot-cnbukm26ebicxiz5mfhd2mkvj4.us-east-2.es.amazonaws.com'; // e.g. search-domain.region.es.amazonaws.com
var index = 'disaster1';
var type = 'my_doc';
var id = 5;

var text = require("./csvjson.json");

text.forEach(element => {
        if(element.request == 1) {
            indexDocument(element);
            id++;
        }
});

function indexDocument(document) {
  var endpoint = new AWS.Endpoint(domain);
  var request = new AWS.HttpRequest(endpoint, region);

  request.method = 'PUT';
  request.path += index + '/' + type + '/' + id;
  request.body = JSON.stringify(document);
  request.headers['host'] = domain;
  request.headers['Content-Type'] = 'application/json';
  request.headers['Content-Length'] = Buffer.byteLength(request.body);

  var credentials = new AWS.EnvironmentCredentials('AWS');
  var signer = new AWS.Signers.V4(request, 'es');
  //signer.addAuthorization(credentials, new Date());

  var client = new AWS.HttpClient();
  client.handleRequest(request, null, function(response) {
    console.log(response.statusCode + ' ' + response.statusMessage);
    var responseBody = '';
    response.on('data', function (chunk) {
      responseBody += chunk;
    });
    response.on('end', function (chunk) {
      console.log('Response body: ' + responseBody);
    });
  }, function(error) {
    console.log('Error: ' + error);
  });
}