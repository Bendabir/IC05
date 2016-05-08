'use strict';

// Compute the intersection of two arrays
function intersect(a, b) {
    var t;

    if (b.length > a.length){
    	t = b;
    	b = a;
    	a = t; // indexOf to loop over shorter
    }

    return a.filter(function (e){
        if(b.indexOf(e) !== -1) { 
        	return true;
        }
    });
}

function search(value, key, array){
	for(var i = 0; i < array.length; i++) {
		if(array[i][key] === value) {
			return true;
        }
    }
	return false;
}

// May be useful for later : i have done some tests via the JS console and
// materialize add/remove the active class when we click on a collapsible header
function collapsibleOpen(divID) {
    return $('#' + divID).hasClass('active');
}