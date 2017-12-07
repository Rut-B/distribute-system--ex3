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
	 var qdata = q.query;
	 var name =qdata.Name;
	 var id =qdata.Id;
	 fs.writeFile('student.txt', name+ ","+id,function(err){
 console.log("written file");
}); 

 }

}).listen(8080);
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

/*
Login(string name,string pswd){
	
	
}

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


 