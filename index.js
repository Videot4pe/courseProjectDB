const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const neo4j = require('neo4j-driver').v1;
const driver = new neo4j.driver("bolt://5.23.52.228", neo4j.auth.basic("neo4j", "lotusflower99"));
const session = driver.session();

app.use(express.urlencoded());
app.use(express.json());

app.listen(port, () => console.log(`Port: ${port}`));

var options = [];

app.get('/init', (req, res) => {
	options = [];
	session
	.run(
		'MATCH (f:City) RETURN f.name'
	)
	.then((result) => {
		result.records.forEach((record) => {
			options.push(record.get('f.name'));
		});
		res.send(JSON.stringify(options));
	})
	.catch((err) => {
		console.log('err', err);
	});
});

app.post('/add_city', (req, res) => {
	var name = req.body.name
	console.log(name);
	session
	.run(
		'CREATE (c:City {name: {a}})', {a: name}
	)
	.then((result) => {
		
	})
	.catch((err) => {
		console.log('err', err);
	});
});

app.post('/add_rel', (req, res) => {
	var dist = req.body.dist;
	var firstCity = req.body.firstCity;
	var secondCity = req.body.secondCity;
	session
	.run(
		'MATCH (a:City),(b:City) WHERE a.name = {f} AND b.name = {s} CREATE (a)-[r:CAN_GET_TO {dist:[{d}]}]->(b) CREATE (b)-[l:CAN_GET_TO {dist:[{d}]}]->(a) return r.dist', {d: dist, f: firstCity, s: secondCity}
	)
	.then((result) => {

	})
	.catch((err) => {
		console.log('err', err);
	});
});

var dist = 0;
var c = [];
var web = [];

function del(c) {
    for (var i = 0; i < c.length; i++)
    	for (var j = i + 1; j < c.length; j++)
    		if (c[i].name === c[j].name)
    		{
    			c.splice(j, 1);
    			j--;
    		}
}

function changeDist(a, dist) {
	c.forEach((b) =>
	{
		if (a === b.name)
			if (dist < b.distance)
			{
				b.distance = dist;
			}
	});
}

function changeVisited(a) {
	c.forEach((b) =>
	{
		if (a === b.name)
			b.visited =  true;
	});
}

function sortByDistance(arr) {
	for(var i = 0; i < arr.length; i++)
		for(var j = i+1; j < arr.length; j++)
			if(arr[i].distance > arr[j].distance)
			{
				var tmp = arr[i];
				arr[i] = arr[j];
				arr[j] = tmp;
			}
}

function find(a) {
	var t = [];
	web.forEach((b) =>
	{
		if (a === b.first)
			t.push(b);
	});
	return t;
}

function delNode(a) {
	for (var i = 0; i < web.length; i++)
	{
		if (web[i].second === a)
		{
			web.splice(i, 1);
			i--;
		}
    }
}

function checkIfVisited() {
	var current = {};
	var minDist = Infinity;
	sortByDistance(c);
	c.forEach((b) =>
	{
		if (minDist > b.distance)
		{
			console.log(b.distance);
			if (b.visited == false) {
				minDist = b.dist;
				current = b;
			}
		}
	});
	console.log("\n\n");
	if (minDist == Infinity)
		return false;
	else
	{
		changeVisited(current.name);
		delNode(current.name);
		dijkstra(current.name);
	}
}

function dijkstra(current) {
	var currentRelations = find(current);
	sortByDistance(currentRelations);
	var currentDist = Infinity;
	c.forEach((b) =>
	{
		if (current === b.name)
		{
			currentDist = b.distance;
		}
	});

	currentRelations.forEach((cr) =>
	{
		changeDist(cr.second, parseInt(currentDist) + parseInt(cr.distance));
	});
	checkIfVisited();
}

app.post('/', function(req, res) {
	dist = 0;
	c = [];
	web = [];
    var first = req.body.cities.firstCity;
    var second = req.body.cities.secondCity;
    var counter = 0;
    session
	.run(
		'MATCH ((f)-[r]-(s)) RETURN f.name, r.dist, s.name'
	)
	.then((result) => {
	    result.records.forEach((record) => {
    		var link = {first: (record.get('f.name')), distance: (record.get('r.dist')), second: (record.get('s.name'))};
    		web.push(link);
	    });
	    web.forEach((a) => 
		{
			var city = {name: a.first, distance: Infinity, visited: false};
			c.push(city);
		});
		del(c);
		changeDist(first, 0);
	    checkIfVisited();
	    c.forEach((b) =>
		{
			if (second === b.name)
			{
				res.send(JSON.stringify(b.distance));
			}
		});
	})
	.catch((err) => {
		console.log('err', err);
	});

});