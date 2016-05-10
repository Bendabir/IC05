// Get the IDs of displayed nodes
function displayedNodes(){
	return s.graph.nodes()
				.filter(function(n){ /* filter() constructs a new array of all the values for which the
										callback function returns a true value */
					return !n.hidden; // so we get here all the nodes not hidden
				})
				.map(function(n){ /* map calls a provided callback function once for each element in an array,
										in order, and constructs a new array from the results */
					return n.id; // so we get the array of all nodes.id not hidden
				});
}

// For hidding or not some of nodes
function applyCategoryFilter(filter, useLocate) {
	var categories= ['CS', 'TM'];

	// If the filter exists
	if(categories.indexOf(filter) != -1){
		// If the filter is not active
		if(search(filter, 'key', filters.serialize()) == 0){
			filters
				.undo(categories)
				.apply();
			filters
				.nodesBy(function(n){
					return n.attributes.Type != 'UV' || n.attributes.Cat == filter;
				}, filter)
				.apply();
		}
	}
	else
		filters.undo(categories).apply(); // Else undo all the filters

	// Zoom on visible nodes
	if (useLocate == undefined) { // then classic call from the CS/TM filter menu
		locate.nodes(displayedNodes());
	}
	/* The only call to applyCategoryFilter with useLocate defined (to false) is in the
		applyBranchFilter (see there for more details) */
}

// For hiding not without relation with the targeted branch
function applyBranchFilter(filter){
	var 
		semesters = [],
		filter_CS_or_TM_toReapply = '',
		toKeep = [],
		categories= ['CS', 'TM'],
		branchs = ['TC', 'GI', 'GSU', 'GM', 'GSM', 'GP', 'GB'];

	if(branchs.indexOf(filter) != -1){
		if(search(filter, 'key', filters.serialize()) == 0){
			// Generate root nodes
			for(var i = 1; i <= 6; i++)
				semesters.push(filter + '0' + i);

			// Undo all other branch filters (showing nodes again)
			filters
				.undo(branchs.filter(function(e){
					return e != filter;
				}))
				.apply();


			/* Before we get nodes linked to the branch, we need to unhidden the possibles UVs nodes
				previously hidden by the CS/TM filter.
					Because, the s.graph.neighbors function will only get the non hidden neighbors */
			categories.forEach(function (cat) {
				if (search(cat, 'key', filters.serialize()) == 1) {
					filter_CS_or_TM_toReapply = cat;
				}
			});
			/* Undo temporarily the categiry filter if one is active :
					here, filter_CS_or_TM_toReapply value is '', 'CS' or 'TM' and applying undo on '' (empty string)
					don't change a thing, so no need for a conditionnal statement "if" */
			filters.undo(filter_CS_or_TM_toReapply).apply();

			// Get ALL the nodes linked to the branch (including the nodes previously hidden)
			semesters.forEach(function(node){
				s.graph.neighbors(node).forEach(function(n){
					if(toKeep.indexOf(n) == -1)
						toKeep.push(n);
				});
			});

			toKeep = toKeep.concat(semesters);


			// Apply filters
			// Reapply filter on the nodes categorie if there was one. Here too, applying a filter on '' don't change a thing
			applyCategoryFilter(filter_CS_or_TM_toReapply, false); /* false in second parameter to avoid the double zoom :
																		the one from applyCategoryFilter and the one at the end
																		 of this function */
			// apply new branch filter :
			filters
				.nodesBy(function(n){
					return toKeep.indexOf(n.id) != -1;
				}, filter)
				.apply();
		}
	}
	else{
		filters.undo(branchs).apply();
	}

	// Zoom on visible nodes
	locate.nodes(displayedNodes());
}

// Unselect all the nodes
function unselectAll(){
	activeState.dropNodes();
}

// Get the modularity of a subset
function getModularity(branch){
	var classes = {
		'TC' : '5',
		'GI' : '2',
		'GM' : '0',
		'GSM' : '0',
		'GSU' : '4',
		'GB' : '1',
		'GP' : '3',
	};

	return classes[branch];
}

// Locate a group of node (by modularity class)
function locateBranch(branch){
	var modularity = getModularity(branch);

	if(typeof modularity !== 'undefined'){
		var nodes = [];

		s.graph.nodes().filter(function(n){
			return n.attributes['Modularity Class'] == modularity;
		}).forEach(function(n){
			nodes.push(n.id);
		});

		locate.nodes(nodes);
	}
}

function showUserUVs(show){
	if(show)	
		filters
				.nodesBy(function(n){
					return search(n.id, 'semestre', userUVs) > 0 || n.user;
				}, 'userNodes')
				.edgesBy(function(e){
					return e.user;
				}, 'userEdges')
				.apply();
	else
		filters.undo('userNodes', 'userEdges').apply();

	// Zoom on visible nodes
	locate.nodes(displayedNodes());
}

// To search a node
function searchNode(nodeID){
	nodeID = nodeID.toUpperCase();
	if(['TC', 'GM', 'GSM', 'GI', 'GSU', 'GP', 'GB'].indexOf(nodeID) != -1){
		locateBranch(nodeID);
		$('#graph-container').focus(); // Give the focus to the graph
	}
	else {
		var searchedNode = s.graph.nodes(nodeID);

		// If the node exists
		if (typeof searchedNode !== 'undefined') {
			if(!searchedNode.hidden){
				// If node isn't displayed, no search
				activeState.addNodes(nodeID);

				if (activeState.nodes().length > 1) {// Then use the plugin locate on the activeState.nodes()
					var nodesInActiveState = [];
					activeState.nodes().forEach(function(n){
						nodesInActiveState.push(n.originalLabel);
					});
					locate.nodes(nodesInActiveState);
					/* TODO @Ben : a mon avis, je pense que ajouter petit à petit les nodes recherchée dans l'activeNodes
						n'est pas forcément une bonne idée, vu qu'à chaque fois ca fait l'intersect et que du coup, c'est
						peut-être pas ce que voulait l'utilisateur à la base.
						On pourrait faire un activeState.dropNodes() puis activeState.addNote(nodeID) à chaque fois. Qu'en penses-tu ?
					 */
				}
				else { // Use sigma camera to avoid the strong zoom of the locate plugin when it locates only one node
					sigma.misc.animation.camera(s.camera, {
						x: searchedNode.x,
						y: searchedNode.y,
						ratio: 0.6
					});
				}
				$('#graph-container').focus(); // Give the focus to the graph
			}
		}
	}
	$('#node-to-search').val('')
}

// For camera handling
function fitSize(){
	// sigma.misc.animation.camera(s.camera, { 
	// 	x:0, 
	// 	y:0,
	// 	ratio: 1 
	// },
	// {
	// 	duration: s.settings('mouseZoomDuration')
	// });
	locate.nodes(displayedNodes());
}

function zoomIn(){
	var ratio = Math.max(
					s.settings('zoomMin'),
					Math.min(s.settings('zoomMax'), s.camera.ratio * (1 / s.settings('zoomingRatio') || 1))
			    );
	sigma.misc.animation.camera(s.camera, { 
        ratio: ratio,
	},
	{
        duration: s.settings('mouseZoomDuration')
	});
}

function zoomOut(){
	var ratio = Math.max(
					s.settings('zoomMin'),
					Math.min(s.settings('zoomMax'), s.camera.ratio * (s.settings('zoomingRatio') || 1))
			    );
	sigma.misc.animation.camera(s.camera, { 
        ratio: ratio,
	},
	{
        duration: s.settings('mouseZoomDuration')
	});
}

// Set the halo to specific nodes
// The size depends on the zoom ratio
function renderHalo(UVs){
	var nodes = [];

	UVs.forEach(function(u){
		var n = s.graph.nodes(u.uv);

		if(typeof n !== "undefined"){
			n.user = true;

			// Check if the node is displayed, otherwise no needs of the halo
			if(n.color != s.settings('disabledColor'))
				nodes.push(n);
		}
	});

	s.renderers[0].halo({
		nodes: nodes,
		nodeHaloSize: 4 / Math.pow(s.camera.ratio, 0.5)
	});
}

// Set the glyphs
// The size depends on the zoom ratio
function renderGlyphs(){
	s.renderers[0].glyphs({
		lineWidth: 2 / Math.pow(s.camera.ratio, 0.5)
	});
}
