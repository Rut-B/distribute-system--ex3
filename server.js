var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');


var server= http.createServer(function (req, res) {

fs.readFile('index.html', function(err, data) {
 res.writeHead(200, {'Content-Type': 'text/html'});
 res.write(data);
 res.end();
});

 var q = url.parse(req.url, true);
 var url_path = q.pathname;
 
 if (url_path == "/sendLogin") {
	 var qdata = q.query;
	 var name =qdata.name;
	 var password = qdata.password;
	 var rule = Login(name, password);

	 console.log(rule);
/*
	 let rawdata = fs.readFileSync('Users.json');
	 let student = JSON.parse(rawdata);
	 console.log(student[0].name);
	 fs.writeFile('student.txt', name+ ","+password,function(err){
 console.log("written file");
}); */

 }
 
}).listen(8080);

//server.use(express.static());
/*

var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
	
	
	
fs.readFile('index.html', function(err, data) {
 res.writeHead(200, {'Content-Type': 'text/html'});
 res.write(data);
 res.end();
});

 var q = url.parse(req.url, true);
 var url_path = q.pathname;
 
 if(url_path=="/sendEmail"){

 console.log("written file");

 }

}).listen(8080);

*/
function Login(name, pswd) {
	
	let rawdata = fs.readFileSync('Users.json');
	let student = JSON.parse(rawdata);
	student.forEach(function (obj) {		
		if ((obj.name == name) && (obj.password == pswd)) {		
			console.log(obj.role);
			return obj.role;console.log("00000");
		}
		
	});
	return null;
}
/*
addStudentToClass(string Course,  string Student, int Grade){
	
}
getListOfCourses(){
	
}

getListStudentsInCourse(string Course){
	
}

getMyGrades(string Student){
	
}


deleteClassStudent(string class,  string student){
	
}
















*/


 