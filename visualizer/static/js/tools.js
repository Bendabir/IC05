// Short function to parse URI
function parseURI(val) {
    var result = '',
        tmp = [];
    location.search
    // .replace ( "?", "" ) 
    // this is better, there might be a question mark inside
    .substr(1)
        .split("&")
        .forEach(function(item){
        	tmp = item.split("=");
        	
        	if(tmp[0] === val) 
        		result = decodeURIComponent(tmp[1]);
    	});

    return result;
}

// Compute the intersection of two arrays
function intersect(a, b) {
    var t;

    if (b.length > a.length){
    	t = b;
    	b = a;
    	a = t; // indexOf to loop over shorter
    }

    return a.filter(function (e){
        if(b.indexOf(e) !== -1) 
        	return true;
    });
}

function search(value, key, array){
	for(var i = 0; i < array.length; i++)
		if(array[i][key] == value)
			return true;

	return false;
}