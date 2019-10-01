LOAD CSV WITH HEADERS FROM "file:///test.csv" AS csvLine CREATE (c:City {id: toInteger(csvLine.id), name: csvLine.name})

LOAD CSV WITH HEADERS FROM "file:///testrel.csv" AS csvLine
WITH csvLine
MATCH (f:City {name: csvLine.start}), (s:City {name: csvLine.end})
CREATE (f)-[:CAN_GET_TO {dist: csvLine.dist}]->(s)

/usr/local/Cellar/neo4j/3.5.6/

pm2 start node_modules/react-scripts/scripts/start.js --name "course"