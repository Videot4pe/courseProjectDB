const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const neo4j = require('neo4j-driver').v1;
const driver = new neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "lotusflower99"));
const session = driver.session();

//var bodyParser = require('body-parser');

app.use(express.urlencoded());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.listen(port, () => console.log(`Port: ${port}`));

app.get('/backend', (req, res) => {
		console.log("Yay");
	  session
	  .run(
	    'MATCH (a)-[r]-(b) WHERE a.name = "Moscow" AND b.name = "London" return r.dist LIMIT 1'
	  )
	  .then((result) => {
	    result.records.forEach((record) => {
	      res.send(JSON.stringify(record.get('r.dist')));
	      console.log(`Distance: ${record.get('r.dist')}`);
	    });
	  })
	  .catch((err) => {
	    console.log('err', err);
	  })
	  .then(() => {
	    session.close();
	    driver.close();
	  });
});

// app.post('/exist', function(req, res){
//     var first = req.body.cities.firstCity;
//     var second = req.body.cities.secondCity;
//     session
// 	  .run(
// 	    'MATCH (a:City {name: {a}})-[r]-(b:City {name: {b}}) return r.dist LIMIT 1', {a: first, b: second}
// 	  )
// 	  .then((result) => {
// 	    result.records.forEach((record) => {
// 	      res.send(JSON.stringify(record.get('r')));
// 	    });
// 	  })
// 	  .catch((err) => {
// 	    console.log('err', err);
// 	  })
// 	  .then(() => {
// 	    session.close();
// 	    driver.close();
// 	  });
// });

var all = [];
var dist = 0;

app.post('/', function(req, res){
    var first = req.body.cities.firstCity;
    var second = req.body.cities.secondCity;
    session
	  .run(
	  	//'MATCH (start:City{name:"London"}), (end:City{name:"Moscow"}) CALL algo.shortestPath.stream(start, end, "dist") YIELD nodeId, dist MATCH (other:City) WHERE id(other) = nodeId RETURN other.name AS name, dist'
	    'MATCH (c:City), (a:City {name: {a}})-[r]-(b:City {name: {b}}) return c.name, r.dist', {a: first, b: second}
	  )
	  .then((result) => {
	    result.records.forEach((record) => {
	    	if (!all.includes(record.get('c.name')))
	    	{
	    		all.push(record.get('c.name'));
	    	}
	    	dist = record.get('r.dist')
	    });
	    res.send(JSON.stringify(dist));
	    all.forEach((a) => { console.log(a)});
	    all = [];
	  })
	  .catch((err) => {
	    console.log('err', err);
	  })
	  .then(() => {
	    session.close();
	    driver.close();
	  });
});

// app.post('/', function(req, res){
//     var first = req.body.cities.firstCity;
//     var second = req.body.cities.secondCity;
//     session
// 	  .run(
// 	  	//'MATCH (start:City{name:"London"}), (end:City{name:"Moscow"}) CALL algo.shortestPath.stream(start, end, "dist") YIELD nodeId, dist MATCH (other:City) WHERE id(other) = nodeId RETURN other.name AS name, dist'
// 	    'MATCH (a:City {name: {a}})-[r]-(b:City {name: {b}}) return r.dist LIMIT 1', {a: first, b: second}
// 	  )
// 	  .then((result) => {
// 	    result.records.forEach((record) => {
// 	    	all.push(record.get('r.dist'));
// 	    });
// 	    res.send(JSON.stringify(all[0]));
// 	    all = [];
// 	  })
// 	  .catch((err) => {
// 	    console.log('err', err);
// 	  })
// 	  .then(() => {
// 	    session.close();
// 	    driver.close();
// 	  });
// });