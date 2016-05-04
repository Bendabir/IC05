// Getting UVs of the user (with synchronous request, a bit dirty but nevermind)
var user = parseURI('login'),
	userUVs = [];
var xhr = new XMLHttpRequest();

var url = document.location.href;

xhr.open('GET', 'getUVs.php?login=' + user, false);
if(user != '')
	xhr.send();

if(xhr.status == 200){
	userUVs = JSON.parse(xhr.responseText);

	// Hiding some things which depends on the user
	if(userUVs.length == 0)
		$('#user-uvs-switch').hide(0);
}

// For hidding or not some of nodes
function applyFilter(){
	var filter = $('#node-category').val(),
		exists = false;

	switch(filter){
		// Checking is dirty and expensive, better to try with exceptions
		case 'CS' : // For hiding TM
			filters.serialize().forEach(function(f){
				if(f.key == 'CS')
					exists = true;
			});

			if(!exists){
				filters.undo('TM');
				filters
					.nodesBy(function(n){
						return n.attributes.Type != 'UV' || n.attributes.Cat == 'CS';
					}, 'CS')
					.apply();
			}
			break;
		case 'TM' : // For hiding CS
			filters.serialize().forEach(function(f){
				if(f.key == 'TM')
					exists = true;
			});

			if(!exists){
				filters.undo('CS');
				filters
					.nodesBy(function(n){
						return n.attributes.Type != 'UV' || n.attributes.Cat == 'TM';
					}, 'TM')
					.apply();
			}
			break;
		default : // Undo filters
			filters.undo('CS', 'TM').apply();
			break;
	}
}

// Unselect all the nodes
function unselectAll(){
	activeState.dropNodes();
}

// Locate a group of node (by modularity class)
function locateBranch(b){
	var classes = {
		'TC' : '5',
		'GI' : '2',
		'GM' : '0',
		'GSM' : '0',
		'GSU' : '4',
		'GB' : '1',
		'GP' : '3',
	};

	var modularity = classes[b];

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
	if(['TC', 'GM', 'GSM', 'GI', 'GSU', 'GP', 'GB'].indexOf(nodeID.toUpperCase()) != -1)
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

// Change renderer
sigma.renderers.def = sigma.renderers.canvas;

// Define a new method to retrieve neighbors of a node
sigma.classes.graph.addMethod('neighbors', function(nodeID){
	var edge,
		neighbors = [];

	// For each edge, we look for neighbors of nodeID
	this.edges().forEach(function(e){
		if((e.target == nodeID || e.source == nodeID) && !e.hidden){
			var pal = (e.target == nodeID) ? e.source : e.target;

			neighbors.push(pal);
		}
	});

    return neighbors;
	});

// Instantiate sigma:
s = new sigma({
	renderer:{
		container: 'graph-container',
	  	type: 'canvas'
  	},
		settings: {
			// Labels
  		defaultLabelColor: '#333',
      	defaultLabelHoverColor: '#fff',
      	labelThreshold: 12, // 7
      	defaultHoverLabelBGColor: '#333',
     	defaultLabelBGColor: '#ddd',
	  	activeFontStyle: 'bold',
	  	defaultLabelActiveColor: '#333',
	  	labelAlignment: 'inside',
	  	labelSize: 'proportional',
	  	labelSizeRatio: 0.55,

	  	// Edges
	  	defaultEdgeType: 'curve',
	  	enableEdgeHovering: false,
	  	edgeHoverHighlightNodes: 'circle',
      	minEdgeSize: 0.1,
      	maxEdgeSize: 2,
	  	
	  	// Nodes
  		minNodeSize: 2, // 3
 	    maxNodeSize: 15, // 10
		nodeActiveBorderSize: 2,
		nodeActiveOuterBorderSize: 3,
		defaultNodeActiveBorderColor: '#fff',
	    defaultNodeActiveOuterBorderColor: 'rgb(236, 81, 72)',
      	
      	// Camera
      	zoomMax: 3,

      	// Glyphs
      	glyphFillColor: 'white',
      	glyphScale: 0.4,
      	glyphTextColor: '#333',

      	// Halos
      	nodeHaloColor: '#333',

      	// Application
      	singleHover: true,
      	sideMargin: 10,

      	// Others
      	disabledColor: '#ddd',
      	disabledLabel: '',
  	}
});

// Renderings the glyphs (which are showing the categorie of the UV)
renderGlyphs();
renderHalo(userUVs);

s.renderers[0].bind('render', function(e){
	renderGlyphs();
	renderHalo(userUVs);
});

// Change angle of the camera to get the graph on the right place
sigma.misc.animation.camera(s.camera, {angle: Math.PI});

// Load graph
sigma.parsers.json(
	'data/uvs.json', 
	s,
	function(){
		// Hiding the loader
		$('#graph-loader').removeClass('active');

		// Saving the color and label then initializing
		s.graph.nodes().forEach(function(n){
			n.originalColor = n.color;
			n.originalLabel = n.label;
			n.disabled = false;

			// Change the shape depending on the node type (UV or Semestre)
			if(n.attributes.Type == 'Semestre'){
				n.type = 'equilateral';
				n.size = 25;
			}
			else{
				n.type = 'circle';
				n.size = 10;
				
				// Adding a glyph for UV
				n.glyphs = [{
					'position': 'top-left',
					'content': n.attributes.Cat, // CS or TM
					'strokeColor': function(){return this.color;},
					'threshold': 6,
					'textThreshold': 1
				}];
			}

		});
		s.graph.edges().forEach(function(e){
			// Changing link between uvs from the user and the semester
			userUVs.forEach(function(data){
				if((e.target == data.uv || e.source == data.uv) && (e.target == data.semestre || e.source == data.semestre)){
					e.originalColor = "#333";
					e.color = "#333";
					e.size = 300;
					e.user = true;
				}
				else
					e.originalColor = e.color;
			});
		});

		// Binding on selected nodes change (so on node click)
		activeState.bind('activeNodes', function(e){
			var toKeep = [],
				heads = [];

			// If no active node
			if(activeState.nodes().length == 0){
				// Update color and label
				s.graph.nodes().forEach(function(n){
					n.color = n.originalColor;
					n.label = n.originalLabel;
					n.disabled = false;
				});

				s.graph.edges().forEach(function(e){
					e.color = e.originalColor;
				});
			}
			else{
				// Check other activated nodes 
				activeState.nodes().forEach(function(n){
					heads.push(n.id);
					var neighbors = s.graph.neighbors(n.id);

					if(toKeep.length == 0)
						toKeep = neighbors;
					else
						toKeep = intersect(toKeep, neighbors);
				});

				toKeep = toKeep.concat(heads); // Merge arrays

				// Update color
				s.graph.nodes().forEach(function(n){
					if(toKeep.indexOf(n.id) != -1){
						n.color = n.originalColor;
						n.label = n.originalLabel;
						n.disabled = false;
					}
					else{
						n.color = s.settings('disabledColor');
						n.label = s.settings('disabledLabel');
						n.disabled = true;
					}
				});

				s.graph.edges().forEach(function(e){
					if(toKeep.indexOf(e.source) != -1 && toKeep.indexOf(e.target) != -1)
						e.color = e.originalColor;
					else
						e.color = s.settings('disabledColor');
				});
			}

			s.refresh(); // Refresh the graph
		});

		s.bind('clickNode', function (e) {
			console.log(e);
			var message = '';
			if (e.data.node.attributes['Type'] == 'UV') {
				message = 'Code : ' + e.data.node.originalLabel + '<br/>'
					+ 'Nom : ' + '-----' + '<br/>' // TODO getNomUV from database of add it to the json graph file
					+ 'Catérogie : ' + e.data.node.attributes['Cat'] + '<br/>'
					+ 'Nombre de crédits : ' + e.data.node.attributes['nbCredits'];
				$('#right-menu-infoUV').html(message);
			}
			else {
				message = 'Semestre : ' + e.data.node.originalLabel;
				$('#right-menu-infoUV').html(message);
			}

		});



		// When clicking outside the graph, getting back to initial state
		s.bind('clickStage', function(e){
			s.graph.nodes().forEach(function(n){
				n.color = n.originalColor;
				n.label = n.originalLabel;
				n.disabled = false;
			});

			s.graph.edges().forEach(function(e){
				e.color = e.originalColor;
			});

			activeState.dropNodes(); // Unselect all nodes

			// clear infos graphe
			$('#right-menu-infoUV').html(''); // TODO ajouter au git

			s.refresh();
		});


		// Binding some hover event for a fancy cursor
		// Some events of Sigma.js are no longer existing in linkurious.js
		s.bind('hovers', function(e){
			if(e.data.enter.nodes.length != 0){
				document.querySelector('body').style.cursor = 'pointer';
				
				// Changing the color of the first node (assume only one can be hovered at the time)
				var node = e.data.enter.nodes[0];

				// If the node was disabled, displaying for a while its data
				if(node.disabled){
					node.color = node.originalColor;
					node.label = node.originalLabel;
					s.refresh();
				}
			}
			else{
				document.querySelector('body').style.cursor = 'default';
				// Changing the color
				var node = e.data.leave.nodes[0];

				// If the node was disabled, hiding its data again
				if(node.disabled){
					node.color = s.settings('disabledColor');
					node.label = s.settings('disabledLabel');
					s.refresh();
				}
			}
		});

		s.refresh();
});

// Instanciate the ActiveState plugin:
var activeState = sigma.plugins.activeState(s);

// Initialize the Select plugin:
var select = sigma.plugins.select(s, activeState, s.renderers[0]);

// Initialize the Keyboard plugin:
var keyboard = sigma.plugins.keyboard(s, s.renderers[0], {
	displacement: -100 // Coded upside down so get it right
});

// Bind the Keyboard plugin to the Select plugin:
select.bindKeyboard(keyboard);

// Binding space + 0 to reinit zoom
keyboard.bind('32+48 32+45 32+96', fitSize);

// Initialize the Filter plugin
var filters = sigma.plugins.filter(s);

// Initialize the Locate plugin
var locate = sigma.plugins.locate(s, {
	zoomDef: 50
});