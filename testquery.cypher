MATCH ()-[r:CAN_GET_TO]-() DELETE r
MATCH (n) delete n

CREATE (London:City {name:'London'})
CREATE (Moscow:City {name:'Moscow'})
CREATE (Paris:City {name:'Paris'})
CREATE (Rome:City {name:'Rome'})

MATCH (a:City),(b:City)
WHERE a.name = "Moscow" AND b.name = "London"
CREATE (a)-[r:CAN_GET_TO {dist:['2500']}]->(b)
CREATE (b)-[r:CAN_GET_TO {dist:['2500']}]->(a)

MATCH (a:City),(b:City)
WHERE a.name = "London" AND b.name = "Rome"
CREATE (a)-[r:CAN_GET_TO {dist:['1300']}]->(b)
CREATE (b)-[g:CAN_GET_TO {dist:['1300']}]->(a)

MATCH (a:City),(b:City)
WHERE a.name = "Moscow" AND b.name = "Paris"
CREATE (a)-[r:CAN_GET_TO {dist:['3000']}]->(b)
CREATE (b)-[g:CAN_GET_TO {dist:['3000']}]->(a)

MATCH (a:City),(b:City)
WHERE a.name = "Paris" AND b.name = "London"
CREATE (a)-[r:CAN_GET_TO {dist:['1000']}]->(b)
CREATE (b)-[g:CAN_GET_TO {dist:['1000']}]->(a)

MATCH (a:City),(b:City)
WHERE a.name = "Moscow" AND b.name = "Rome"
CREATE (a)-[r:CAN_GET_TO {dist:['1000']}]->(b)
CREATE (b)-[g:CAN_GET_TO {dist:['1000']}]->(a)

CREATE (Moscow)-[:CAN_GET_TO {dist:['2500']}]->(London)


CREATE (TheMatrix:Movie {title:'The Matrix', released:1999, tagline:'Welcome to the Real World'})


CREATE (Keanu:Person {name:'Keanu Reeves', born:1964})

CREATE
  (Keanu)-[:ACTED_IN {roles:['Neo']}]->(TheMatrix)

CREATE
  (Keanu)-[:ACTED_IN {roles:['Kevin Lomax']}]->(TheDevilsAdvocate)


CREATE (London:City {name:'London'})
CREATE (Moscow:City {name:'Moscow'})
MATCH (a:City),(b:City)
WHERE a.name = "Moscow" AND b.name = "London"
CREATE (a)-[r:CAN_GET_TO {dist:['2500']}]->(b)
RETURN r

MATCH (n)-[r]-(m) RETURN r.dist;


node index.js
npm start
neo4j start