var http = require('http');
var url = require('url');
var jsonfile = require('jsonfile');
var fs = require('fs');
var express = require('express');


var server= http.createServer(function (req, res) {

	var q = url.parse(req.url, true);
	var url_path = q.pathname; 

	if(url_path == '/') {
		fs.readFile('index.html', function(err, data) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.end();
		});
	} else if (url_path == "/sendLogin") {
		var qdata = q.query;
		var name =qdata.name;
		var password = qdata.password;
		var rule = Login(name, password);
		console.log("rule");
		console.log(rule);
		res.end(rule);
	} else if (url_path == "/addStudentToClass") {
		var qdata = q.query;
		var course = qdata.course;
		var student = qdata.student;
		var grade = qdata.grade;
		var add = addStudentToClass(course, student, grade); 
		res.end(add);
	}






/* var q = url.parse(req.url, true);
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
/*
 } else if (url_path == "/addStudentToClass") {
	 var qdata = q.query;
	 var course = qdata.course;
	 var student = qdata.student;
	 var grade = qdata.grade;
	 var rule = addStudentToClass(course, student, grade); 
	 }*/
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
	console.log(student);
	var rule = "none";
	student.forEach(function (obj) {		
		if ((obj.name == name) && (obj.password == pswd)) {		
			//console.log(obj.role);
			if (obj.role == "admin") {
				rule= "admin";
			} else {
				rule = "student";
			}
		}
		
	});
	return rule;
}

function addStudentToClass(course, student, grade){
	console.log('hi shira c:'+course +' s:'+student+' g:'+grade);
	let flag = 0;
	let rawdata = fs.readFileSync('Courses.json');
	let courses = JSON.parse(rawdata);
	console.log(courses);
	courses.forEach(function (obj) {		
		if (obj.name == course) {		
			console.log('course exists');
			flag = 1;
			//add student and his grade to specipic json course
			let course_data = fs.readFileSync(course+'.json');
			let current_course = JSON.parse(course_data);
			var data = {"student" : student, "grade" : grade};
			current_course.push(data);
			fs.writeFileSync(course+'.json', JSON.stringify(current_course));
		}
	});
	if (!flag) {
		//add course to courses list
		console.log('course not exists.. need to create...');
		var data = {"name" : course};
		courses.push(data);
		fs.writeFileSync('Courses.json', JSON.stringify(courses));
		//add student and his grade to specipic json course
		let course_data = fs.readFileSync(course+'.json');
		let current_course = JSON.parse(course_data);
		var data = {"student" : student, "grade" : grade};
		current_course.push(data);
		fs.writeFileSync(course+'.json', JSON.stringify(current_course));
	}
	/*
	var jsonfile = require('jsonfile');
for (i = 0; i < 11 ; i++) {
jsonfile.writeFile('loop.json', "id :" + i + " square :" + i * i);
}
	*/
	return "hi";
}
/*
getListOfCourses(){
	
}

getListStudentsInCourse(string Course){
	
}

getMyGrades(string Student){
	
}


deleteClassStudent(string class,  string student){
	
}
















*/


 