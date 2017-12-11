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
	}

	else if (url_path == "/sendLogin") {
		var qdata = q.query;
		var name =qdata.name;
		var password = qdata.password;
		var rule = Login(name, password);
		console.log("rule");
		console.log(rule);
		res.end(rule);
	}
	else if (url_path == "/addStudentToClass") {
		var qdata = q.query;
		var course = qdata.course;
		var student = qdata.student;
		var grade = qdata.grade;
		var add = addStudentToClass(course, student, grade);
		res.end(add);
	}
	else
		if (url_path == "/course_list") {
			var list = getListOfCourses(res);
			console.log(list);
			res.end(list);
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

//*******************************
function Login(name, pswd) {

	let rawdata = fs.readFileSync('Users.json');
	let student = JSON.parse(rawdata);

	var rule = "none";
	student.forEach(function (obj) {
		if ((obj.name == name) && (obj.password == pswd)) {
			if (obj.role == "admin") {
				rule= "admin";
			}
			else if (obj.role == "student") {
				rule = "student";
			}
		}

	});
	return rule;
}


//*********************************

function addStudentToClass(course, student, grade) {

	console.log('hi shira c:'+course +' s:'+student+' g:'+grade);

	let exist_course = 0;
	let exist_std=0;
	let rawdata = fs.readFileSync('Courses.json');
	let courses = JSON.parse(rawdata);
	console.log(courses);

	//check if course exist
	courses.forEach(function (obj) {
		if (obj.name == course) {
			console.log('course exists');//if the course is exist
			exist_course = 1;
		}
	});

	if(!exist_course) {

		//add course to courses list
		console.log('course not exists.. need to create...');
		var data = {"name" : course};
		courses.push(data);
		fs.writeFileSync('Courses.json', JSON.stringify(courses));

		var current_course=[];
		var data = {"student" : student, "grade" : grade};
		current_course.push(data);
		fs.writeFileSync(course+'.json', JSON.stringify(current_course));
	}

	if(exist_course)//check if student exist;
	{
		console.log("exist course just add std");
		let course_data = fs.readFileSync(course+'.json');//read student of this course
		let current_course = JSON.parse(course_data);
		
		current_course.forEach(function(name_std) {
			if(name_std.student == student)
			{
				exist_std = 1;
				
			}
		});

		//add student and his grade to specipic json course
		if(!exist_std)
		{
			var data = {"student" : student, "grade" : grade};
			current_course.push(data);
			fs.writeFileSync(course+'.json', JSON.stringify(current_course));
		}
	}

}


function getListOfCourses(res){
	let rawdata = fs.readFileSync('Courses.json');
	let courses = JSON.parse(rawdata);

	console.log(courses);
	var list = courses.sort(predicateBy("name"));
	console.log(list);
	res.end(""+list);

}

function predicateBy(prop) {
	return function (a, b) {
		if (a[prop] > b[prop]) {
			return 1;
		} else if (a[prop] < b[prop]) {
			return -1;
		}
		return 0;
	}
}
/*
getListStudentsInCourse(string Course){

}

getMyGrades(string Student){

}


deleteClassStudent(string class,  string student){

}
















*/


