var cities = ["Mumbai", "Tianjin", "Manila", "Moscow", "Tokyo", "Dhaka", "Istanbul", "Karachi", "Beijing", "Shanghai"];
var resultCSV = [];
var distance = [];

var template = ["\"_id\"", "\"_labels\"", "\"name\""];
resultCSV.push(template);

for(var i = 0; i < cities.length; i++) {
	var tmp = ["\"" + i.toString(10) + "\"", "\":City\"", "\"" + cities[i] + "\""];
	resultCSV.push(tmp);
}

let csvContent = resultCSV.map(e => e.join(",")).join("\n");
//var encodedUri = encodeURI(csvContent);
console.log(csvContent);

template = ["\"start\"", "\"end\"", "\"_type\"", "\"dist\""];
resultCSV = [];
resultCSV.push(template);

function relExist()
{
	if (Math.floor((Math.random() * 5) + 1) < 3)
		return true
	else
		return false;
}
for(var i = 0; i < cities.length; i++) {
	for (var j = i + 1; j < cities.length; j++)
	{
		if (relExist())
		{	
			var dist = Math.floor((Math.random() * 4000) + 1000);
			var tmp = ["\"" + cities[i] + "\"", "\"" + cities[j] + "\"", "\"CAN_GET_TO\"", "\"" + dist.toString(10) + "\""];
			resultCSV.push(tmp);
			tmp = ["\"" + cities[j] + "\"", "\"" + cities[i] + "\"", "\"CAN_GET_TO\"", "\"" + dist.toString(10) + "\""];
			resultCSV.push(tmp);
		}
	}
}

csvContent = resultCSV.map(e => e.join(",")).join("\n");
//var encodedUri = encodeURI(csvContent);
console.log(csvContent);