'use strict';

/* global sigma, user, $, renderGlyphs, renderHalo, search, intersect
   jquery: true */

var activeGraph;
var graphBipartite;
var userUVs = [];


// If the user is specified
if (user){
	// Getting UVs of the user
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'getUVs');
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status === 200) {
			userUVs = JSON.parse(xhr.responseText);

			// Hiding some things which depends on the user
			// if(userUVs.length == 0)
			// 	$('#user-uvs-switch').hide(0);
			init_a_graph(
				'graphBipartite',
				//'static/data/graph_bipartite.json',
				'static/data/color_24Mai.json',
				userUVs,
				function(aGraph){ // callback function called when init_a_graph is done
					graphBipartite = aGraph;
					// Hiding the loader
					$('#graph-loader').removeClass('active');
					activeGraph = graphBipartite;
					activeGraph.sigmaInstance.refresh();
				}
			);
		}
	};

	xhr.send();
}
else {
	init_a_graph(
		'graphBipartite',
		//'static/data/graph_bipartite.json',
		'static/data/color_24Mai.json',
		userUVs,
		function(aGraph){ // callback function called when init_a_graph is done
			graphBipartite = aGraph;
			// Hiding the loader
			$('#graph-loader').removeClass('active');
			activeGraph = graphBipartite;
			activeGraph.sigmaInstance.refresh();
		}
	);

	// Disabling some features
	$('#visibility-me').prop('disabled', true);
	$('#visibility-same').prop('disabled', true);
}