const http = require('http');
const fs = require('fs');
const path = require('path');
const statPath = 'statistics.json';

const types = {
	'.js' : {
		contentType: 'text/js'
	},
	'.css' : {
		contentType: 'text/css'
	},
	'.png' : {
		contentType: 'image/png'
	},
	'.html' : {
		contentType: 'text/html'
	},
	'.json' : {
		contentType: 'application/json'
	},
	default: {
		contentType : 'text/plain'
	}
}

const server = http.createServer();

server.on('request', (request, response) => {
 const {method, url, headers} = request;


if (method === 'POST') {
	console.log(`${method}, ${url}`);

	let postData = '';

	request.on('data', data => {
		postData += data;
	});

	request.on('end', ()=> {
		processPost(request, response, postData);
	});

 } else {
 processGet(request, response);
}});

function processGet(request, response) { 

 const {method,url,headers} = request;
 console.log(`${method}, ${url}`);

 if (url === '/getStat') {
 	getTop10((err, top10) => {
	if (err) {
	response.writeHead(500, {'Content-Type': 'text/plain' });
	response.end('File not found');
	} else {
	let data = JSON.stringify(top10);
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(data);
	}
	});
	return;
 } 

 let filepath = url;

 if (filepath ==='/') {
 	filepath = '/public/index.html';
 }

 let fileExt = path.extname(filepath);
 let responseParams = types[fileExt] || types['default'];

 response.setHeader("Content-Type", responseParams.contentType);

 filepath = '.' + filepath;

 let readStream = fs.createReadStream(filepath);

 readStream.on('error', (err) => {
	response.statusCode = 404;
	response.end();
});

 readStream.pipe(response);
};

function getTop10(done) {

  fs.readFile(statPath, "utf8", (err, data) => {

    if (err) {
      return done(err);
    }
  
    let results = JSON.parse(data);

    sortStat(results);

    let res = results.slice(0,10);

    done(null, JSON.stringify(res));
  });
};

function sortStat(stats) {
	stats.sort((a, b) => a.score < b.score);
}

function processPost( request, response, postData) {

 let data = {};
 let resArr = [];

 try {
   data = JSON.parse(postData);
   response.statusCode = 201;
 } catch (e) {
 	response.statusCode = 400;
 };

 fs.readFile (statPath, (err, stat) => {
 	if (err) {
 		throw err;
 	}

 	resArr = JSON.parse(stat);

 	resArr.push(data);

	let arrToWrite = JSON.stringify(resArr, null, 2);

	fs.writeFile(statPath, arrToWrite, function () {
		sortStat(JSON.parse(arrToWrite));

	});
 });

 


 response.end();
};

 server.listen(80);