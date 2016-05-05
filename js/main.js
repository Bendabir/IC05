var user = parseURI('login'),
	userUVs = [],
	tagsForSearchBar = ['GI', //  - Génie Informatique
		'GB', // Génie Biologique
		'GM', // Génie Mécanique
		'GSM', // Génie des Systèmes Mécaniques
		'GP', // Génie des Procédés
		'TC', // Tronc Commun
		'GSU']; // Génie des Systèmes Urbains

// Graph's var	
var	s,
	activeState,
	select,
	keyboard,
	filters,
	locate = null;

// If the user is specified
if(user != ''){
	// Getting UVs of the user
	var xhr = new XMLHttpRequest(),
		url = document.location.href;

	xhr.open('GET', 'getUVs.php?login=' + user);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			userUVs = JSON.parse(xhr.responseText);

			// Hiding some things which depends on the user
			// if(userUVs.length == 0)
			// 	$('#user-uvs-switch').hide(0);

			init();
		}
	};

	xhr.send();
}
else{
	init();

	// Disabling some features
	$('#visibility-me').prop('disabled', true);
	$('#visibility-same').prop('disabled', true);
}

function init(){
	// Change renderer
	sigma.renderers.def = sigma.renderers.canvas;

	// Define a new method to retrieve neighbors of a node
	sigma.classes.graph.addMethod('neighbors', function(nodeID){
		var edge,
			neighbors = [];

		// For each edge, we look for visible neighbors of nodeID
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
		  	labelSizeRatio: 0.49, // the size of the label relativly to the node size

		  	// Edges
		  	defaultEdgeType: 'curve',
		  	enableEdgeHovering: false,
		  	edgeHoverHighlightNodes: 'circle',
	      	minEdgeSize: 0.1,
	      	maxEdgeSize: 1, // v1: 2
		  	
		  	// Nodes
	  		minNodeSize: 5, // v1: 3 // v2: 2
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

			// Zoom
			// The power degrees applied to the nodes / edges size relatively to the zooming level (https://github.com/jacomyal/sigma.js/wiki/Settings#camera-settings)
			nodesPowRatio: 0.7, // default value 0.5
			edgesPowRatio: 0.5, // default value 0.5

			// Perf
			autoResize: false // If true, the instance will refresh itself whenever a resize event is dispatched from the window object
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
				tagsForSearchBar.push(n.id); // add tags for the autocomplete search

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
			tagsForSearchBar.sort(); // sort the array containing the tags for the autocomplete search bar


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

				var message;

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

					message = 'Aucun noeud sélectionné';
					$('#right-menu-infoUV').html(message);
				}
				else{
					// Display information about the last selected node
					var selectedNode = activeState.nodes()[activeState.nodes().length - 1];
					if(selectedNode.attributes['Type'] == 'UV') {
						message = 'Code : ' + selectedNode.id + '<br/>'
							+ 'Nom : ' + selectedNode.attributes['nomUV'] + '<br/>'
							+ 'Catégorie : ' + selectedNode.attributes['Cat'] + '<br/>'
							+ 'Nombre de crédits : ' + selectedNode.attributes['nbCredits'];
						$('#right-menu-infoUV').html(message);
					}
					else {
						var nbUVs = s.graph.neighbors(selectedNode.id).length;
						message = 'Semestre : ' + selectedNode.id + '<br />'
								+ 'En lien avec ' + nbUVs + ' UV' + ((nbUVs > 1) ? 's' : '');
						$('#right-menu-infoUV').html(message);
					}

					// Check other activated nodes 
					activeState.nodes().forEach(function(n){
						heads.push(n.id);
						var neighbors = s.graph.neighbors(n.id);

						// Init the set with all neighbors
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

				s.refresh();
			});

			// s.bind('clickNode', function (e) {
			// 	// var message = '';
			// 	// if (e.data.node.attributes['Type'] == 'UV') {
			// 	// 	message = 'Code : ' + e.data.node.originalLabel + '<br/>'
			// 	// 		+ 'Nom : ' + '-----' + '<br/>' // TODO getNomUV from database of add it to the json graph file
			// 	// 		+ 'Catégorie : ' + e.data.node.attributes['Cat'] + '<br/>'
			// 	// 		+ 'Nombre de crédits : ' + e.data.node.attributes['nbCredits'];
			// 	// 	$('#right-menu-infoUV').html(message);
			// 	// }
			// 	// else {
			// 	// 	message = 'Semestre : ' + e.data.node.originalLabel;
			// 	// 	$('#right-menu-infoUV').html(message);
			// 	// }

			// 	// s.refresh();
			// });

			// When clicking outside the graph, getting back to initial state
			// No need to reinit the nodes/edges or to refresh because the handler on actives nodes is doing it
			s.bind('clickStage', function(e){
				activeState.dropNodes(); // Unselect all nodes
				$('#right-menu-infoUV').html('Aucun noeud sélectionné');
			});

			// Binding some hover event for a fancy cursor
			// Some events of Sigma.js are no longer existing in linkurious.js
			s.bind('hovers', function(e){
				if(e.data.enter.nodes.length != 0){
					$('body').css('cursor', 'pointer');
					
					// Changing the color of the first node (assume only one can be hovered at the time)
					var node = e.data.enter.nodes[0];

					// If the node was disabled, displaying for a while its data
					if(node.disabled){
						node.color = node.originalColor;
						node.label = node.originalLabel;
					}
				}
				else{
					$('body').css('cursor', 'default');

					// Changing the color
					var node = e.data.leave.nodes[0];

					// If the node was disabled, hiding its data again
					if(node.disabled){
						node.color = s.settings('disabledColor');
						node.label = s.settings('disabledLabel');
					}
				}
				
				s.refresh();
			});

			s.refresh();
		});

	// Instanciate the ActiveState plugin:
	activeState = sigma.plugins.activeState(s);

	// Initialize the Select plugin:
	select = sigma.plugins.select(s, activeState, s.renderers[0]);

	// Initialize the Keyboard plugin:
	keyboard = sigma.plugins.keyboard(s, s.renderers[0], {
		displacement: -100 // Coded upside down so get it right
	});

	// Bind the Keyboard plugin to the Select plugin:
	select.bindKeyboard(keyboard);

	// Binding space + 0 to reinit zoom
	keyboard.bind('32+48 32+45 32+96', fitSize);

	// Initialize the Filter plugin
	filters = sigma.plugins.filter(s);

	// Initialize the Locate plugin
	locate = sigma.plugins.locate(s, {
		zoomDef: 2
	});
}
