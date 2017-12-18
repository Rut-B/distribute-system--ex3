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
		res.write(rule);
		res.end();
	}
	else if (url_path == "/addStudentToClass") {
		var qdata = q.query;
		var course = qdata.course;
		var student = qdata.student;
		var grade = qdata.grade;
		var add = addStudentToClass(course, student, grade);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(add);
		res.end();

	} else if (url_path == "/deleteClassStudent") {
		var qdata = q.query;
		var course = qdata.course;
		var student = qdata.student;
		var delete_message = deleteClassStudent(course, student);
		console.log(delete_message);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(delete_message);
		res.end();
	}
	else
		if (url_path == "/course_list") {
			var list = getListOfCourses();
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.write(JSON.stringify(list));
			res.end();
		}
		else if (url_path == "/list_stu_in_course") {
				var qdata = q.query;
				var course = qdata.course;
				var list_stu = getListStudentsInCourse(course);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(list_stu));
				res.end();
		} else if (url_path == "/getMyGrades") {
					var qdata = q.query;
					var name = qdata.name;
					var list_courses = getMyGrades(name);
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(list_courses));
					res.end();
				}
}).listen(8080);



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
	let exist_course = 0;
	let exist_std=0;
	let rawdata = fs.readFileSync('Courses.json');
	let courses = JSON.parse(rawdata);
	//check if course exist
	console.log(courses);
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
		courses = courses.sort(predicateBy("name"));
		fs.writeFileSync('Courses.json', JSON.stringify(courses));

		var current_course=[];
		var data = {"student" : student, "grade" : grade};
		current_course.push(data);
		current_course = current_course.sort(predicateBy("name"));
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
			current_course = current_course.sort(predicateBy("name"));
			fs.writeFileSync(course+'.json', JSON.stringify(current_course));
		}
	}


	//add to student this course:
	exist_course = 0;
	
	if (fs.existsSync(student + '.json')) {
		console.log("exist student");
		//check if this course exist;
		let rawdata = fs.readFileSync(student + '.json');
		let courses = JSON.parse(rawdata);
		console.log(courses);
		courses.forEach(function (obj) {
			if (obj.course == course) {
				console.log('course exists');//if the course is exist
				exist_course = 1;
			}
		});

		if (!exist_course) {

			//add course to courses list
			console.log('course not exists.. need to add...');
			var data = { "course": course ,"grade":grade};
			courses.push(data);
			courses = courses.sort(predicateBy("name"));
			fs.writeFileSync(student+'.json', JSON.stringify(courses));
			
		}
	}
	else {//create student file
		var current_course = [];
		var data = { "course": course, "grade": grade };
		current_course.push(data);
		current_course = current_course.sort(predicateBy("name"));
		fs.writeFileSync(student + '.json', JSON.stringify(current_course));
	}
	return "add...";

}

//****************************************
function getListOfCourses(res){
	let rawdata = fs.readFileSync('Courses.json');
	let courses = JSON.parse(rawdata);

	console.log(courses);
	var list = courses;//courses.sort(predicateBy("name"));
	return list;
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

function getListStudentsInCourse(course) {
	var flag_course = 0;
	let rawdata = fs.readFileSync('Courses.json');
	let courses = JSON.parse(rawdata);
	courses.forEach(function (obj) {
		if ((obj.name == course)) {
			flag_course = 1;	
		}

	});
	if (flag_course) {
		let rawdata = fs.readFileSync(course + '.json');
		let student_list = JSON.parse(rawdata);
		return student_list;
	}
	else
		return null;
}

function getMyGrades(student){

	if (fs.existsSync(student + '.json')) {
		let rawdata = fs.readFileSync(student + '.json');
		let student_list = JSON.parse(rawdata);
		return student_list;
	}
	else {
		console.log("ERROR");
		return null;
	}
}

function deleteClassStudent(course, student) {
	var flag_course = 0;
	var flag_student = 0;
	var messgae = "";
	let rawdata = fs.readFileSync('Courses.json');
	let courses = JSON.parse(rawdata);
	courses.forEach(function (obj) {
		if ((obj.name == course)) {
			flag_course = 1;	
		}

	});
	if (!flag_course) {
		messgae = "course not exist";
	} else {
		let rawdata = fs.readFileSync(course+'.json');
		let course_list = JSON.parse(rawdata);
		if(student == "None" || student == "") {//delete all students
			course_list.forEach(function (obj) {
				course_list.pop(obj);
			});
			console.log("delete all students");
			messgae = "delete all students";
		} else {
			course_list.forEach(function (obj) {
				if (obj.student == student) {
					course_list.pop(obj);
					flag_student = 1;
				}
			});
			if (!flag_student) {
				console.log("student not exist in this courses");
				messgae = "student not exist in this course";
			} else {
				console.log("delete the student");
				messgae = "delete the student";
			}
		}
		fs.writeFileSync(course+'.json', JSON.stringify(course_list));
	}
	return messgae;
}
