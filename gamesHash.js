var HashMap = require('hashmap');
var map = new HashMap();

map.set("1", "string one");
map.set("2", "string two");

module.exports = {
	
	week : function(weekNumber){
		return map.get(weekNumber);
	}	
	
};