// For hidding or not some of nodes
function applyCategoryFilter(){
	var filter = $('#node-category').val(),
		categories= ['CS', 'TM'];

	if(filter != 'All' && filter != ''){
		if(!search(filter, 'key', filters.serialize())){
			filters.undo(categories.filter(function(e){
				return e != filter;
			}))
			filters
				.nodesBy(function(n){
					return n.attributes.Type != 'UV' || n.attributes.Cat == filter;
				}, filter)
				.apply();
		}
	}
	else
		filters.undo(categories).apply();
}

// For hiding not without relation with the targeted branch
function applyBranchFilter(){
	var filter = $('#node-branch').val(),
		branchs = ['TC', 'GI', 'GM', 'GSM', 'GSU', 'GP', 'GB'];

	if(filter != 'All' && filter != ''){
		if(!search(filter, 'key', filters.serialize())){
			filters.undo(branchs.filter(function(e){
				return e != filter;
			}))
			filters
				.nodesBy(function(n){
					return n.attributes['Modularity Class'] == getModularity(filter);
				}, filter)
				.apply();
		}
	}
	else
		filters.undo(branchs).apply();
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
			nodes.push(n.originalLabel);
		});

		locate.nodes(nodes);
	}
}

function showUserUVs(show){
	if(show)	
		filters
				.nodesBy(function(n){
					return search(n.originalLabel, 'semestre', userUVs) || n.user;
				}, 'userNodes')
				.edgesBy(function(e){
					return e.user;
				}, 'userEdges')
				.apply();
	else
		filters.undo('userNodes', 'userEdges').apply();
}

// To search a node
function searchNode(nodeID){
	nodeID = nodeID.toUpperCase();
	if(['TC', 'GM', 'GSM', 'GI', 'GSU', 'GP', 'GB'].indexOf(nodeID) != -1)
		locateBranch(nodeID);
	else
		// If the node exists
		if(typeof s.graph.nodes(nodeID) !== 'undefined'){
			activeState.addNodes(nodeID);
			locate.nodes(nodeID);
		}

	$('#node-to-search').val('');
}

// For camera handling
function fitSize(){
	sigma.misc.animation.camera(s.camera, { 
		x:0, 
		y:0,
		ratio: 1 
	},
	{
		duration: s.settings('mouseZoomDuration')
	});
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
	var nodes = []

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