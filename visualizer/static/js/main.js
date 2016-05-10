'use strict';

/* global sigma, user, $, renderGlyphs, renderHalo, search, intersect
   jquery: true */

var userUVs = [],
	tagsForSearchBar = [
		'GI', //  - Génie Informatique
		'GB', // Génie Biologique
		'GM', // Génie Mécanique
		'GSM', // Génie des Systèmes Mécaniques
		'GP', // Génie des Procédés
		'TC', // Tronc Commun
		'GSU'
	]; // Génie des Systèmes Urbains

// Graph's var	
var	s,
	activeState,
	select,
	keyboard,
	filters,
	locate,
	design,
	legend;

// Generate a number of star icons according to the grade
function generateStars(grade){
	var maxGrade = 10,
		minGrade = 0,
		ratio = 2,
		stars = '';

	if(grade >= minGrade && grade <= maxGrade){
		// Converting the grade out of 5
		grade = Math.round(grade);
		grade /= ratio;

		// Generating icons
		stars += '<i class="material-icons">star</i>'.repeat(grade);
		stars += '<i class="material-icons">star_half</i>'.repeat(Math.round(grade - Math.floor(grade)));
		stars += '<i class="material-icons">star_border</i>'.repeat(Math.floor(maxGrade / ratio - grade));
	}
	
	return stars;
}

function uvMessage (selectedNode, uvwebData) {
	uvwebData.desc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lacinia augue sed tellus luctus, a cursus enim suscipit. Phasellus laoreet blandit arcu fringilla tincidunt. Proin sit amet euismod magna. Cras luctus at arcu sed vehicula. Fusce ut ex molestie, bibendum turpis eget, congue tortor. Nulla sed sapien et justo faucibus mattis. Vestibulum blandit justo ac nisi lacinia tristique. Pellentesque eros lorem, facilisis a risus eget, porttitor interdum tellus. Proin sagittis lacus eu tellus pulvinar mattis.';

	var message = '<ul class="collection">';
			message += '<li class="collection-item center-align"><h5>' + selectedNode.id + ' - ' + selectedNode.attributes.nomUV + '</h5></li>';
			message += '<li class="collection-item">';
				message +=	'<div class="row">';
					message +=	'<div class="col s6 center-align">';
						message +=	'<b>Note sur <a href="https://assos.utc.fr/uvweb/uv/' + selectedNode.id + '" target="_blank">UVWeb</a></b><br>';
						message +=	'<div>' + (uvwebData.note ? generateStars(parseFloat(uvwebData.note)) : 'Note indisponible') + '</div>';
						message +=	'</div>';
							message +=	'<div class="col s6 center-align">';
								message +=	'<b>Taux de réussite</b><br />';
								message +=	'<div>00,00% </div>';
							message +=	'</div>';
						message +=	'</div>';
				message +=	'</div>';
			message +=	'</li>';
			message += '<li class="collection-item" style="text-align: justify;">' + uvwebData.desc.replace(/^(.{500}[^\s]*).*/, "$1") + '... <a href="#">Lire la suite</a></li>';
			message +=	'<li class="collection-item">';
				message +=	'<div class="row">';
					message +=	'<div class="col s3 center-align">';
						message +=	'<i class="material-icons">class</i><br><div>' + selectedNode.attributes.Cat + '</div>';
					message +=	'</div>';
					message +=	'<div class="col s3 center-align">';
						message +=	'<i class="material-icons">school</i><br><div>' + selectedNode.attributes.nbCredits + ' ECTS</div>';
					message +=	'</div>';
					message += '<div class="col s3 center-align">';
						message +=	'<i class="material-icons">group</i><br><div>Effectif</div>';
					message +=	'</div>';
						message +=	'<div class="col s3 center-align"><i class="material-icons">access_time</i><br><div>Semestre</div>';
					message +=	'</div>';
				message +=	'</div>';
			message +=	'</li>';
			message +=	'<li class="collection-item center-align">';
				message += '<button class="btn">Ajouter à mon parcours</button>';
			message +=	'</li>';
		message += '</ul>';

	return message;
}

function changeInfobox () {
	var message;
	var selectedNode = activeState.nodes()[activeState.nodes().length - 1];
	if (selectedNode.attributes.Type === 'UV') {
		// $('#right-menu-infoUV').html('<div class="container"><div class="progress"><div class="indeterminate"></div></div></div>');
		$.ajax('uvweb?uv=' + selectedNode.id, {
			success: function (uvwebData) {
				message = uvMessage(selectedNode, uvwebData);
				$('#right-menu-infoUV').html(message);
				$('#right-menu').show();		
			},
			error: function () {
				message = uvMessage(selectedNode);
				$('#right-menu-infoUV').html(message);
				$('#right-menu').show();		
			}
		});
	}
	else
		$('#right-menu').hide();

	// else {
	// 	var nbUVs = s.graph.neighbors(selectedNode.id).length;
	// 	message = '<p><b>Semestre</b> : ' + selectedNode.id + '<br />' +
	// 				'En lien avec ' + nbUVs + ' UV' + ((nbUVs > 1) ? 's' : '');
	// 	message += '</p>';
	// 	$('#right-menu-infoUV').html(message);
	// }
}

function nodeInit (n) {
	tagsForSearchBar.push(n.id); // add tags for the autocomplete search

	n.originalColor = n.color;
	n.originalLabel = n.label;
	n.disabled = false;
	// n.data = {};
	// n.data.properties = {};
	// n.data.properties.categorie = n.attributes.Type;
	// n.data.properties.couleur = n.originalColor;

	// Change the shape depending on the node type (UV or Semestre)
	if(n.attributes.Type === 'Semestre'){
		n.type = 'equilateral';
		n.size = 25;
	} else {
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
}

function isLink (e, node1, node2) {
	return (e.target === node1 && e.source === node2) || (e.target === node2 && e.source === node1);
}

function linkInit (e) {
	// Changing link between uvs from the user and the semester
	userUVs.forEach(function(data){
		if (isLink(e, data.uv, data.semestre)) {
			e.originalColor = "#333";
			e.color = "#333";
			e.size = 300;
			e.user = true;
		}
		else {
			e.originalColor = e.color;
		}
	});
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
		  	font: 'Roboto',

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

	      	// Legends
  			legendFontFamily: 'Roboto',
			legendTitleFontFamily: 'Roboto',
			legendFontColor: '#333',
			legendTitleFontColor: '#333',
			legendShapeColor: '#333',
			legendBorderColor: '#aaa',
			legendBorderRadius: 3,
			legendBorderWidth: 0.5,

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

	s.renderers[0].bind('render', function() {
		renderGlyphs();
		renderHalo(userUVs);
	});

	// Change angle of the camera to get the graph on the right place
	sigma.misc.animation.camera(s.camera, {angle: Math.PI});

	// Load graph
	sigma.parsers.json(
		'static/data/uvs.json', 
		s,
		function(){
			// Hiding the loader
			$('#graph-loader').removeClass('active');

			// Saving the color and label then initializing
			s.graph.nodes().forEach(nodeInit);
			tagsForSearchBar.sort(); // sort the array containing the tags for the autocomplete search bar

			s.graph.edges().forEach(linkInit);

			// Binding on selected nodes change (so on node click)
			activeState.bind('activeNodes', function() {
				var toKeep = [],
					roots = [];

				var message;

				// If no active node
				if(activeState.nodes().length == 0) {
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
					// Display information about the last selected node
					changeInfobox(message);
					// Check other activated nodes 
					activeState.nodes().forEach(function(n){
						roots.push(n.id);
						var neighbors = s.graph.neighbors(n.id);

						// Init the set with all neighbors
						if(toKeep.length == 0)
							toKeep = neighbors;
						else
							toKeep = intersect(toKeep, neighbors);

						toKeep = toKeep.concat(roots); // Merge arrays
					});


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
						if(toKeep.indexOf(e.source) !== -1 && toKeep.indexOf(e.target) !== -1) {
							e.color = e.originalColor;
						} else {
							e.color = s.settings('disabledColor');
						}
					});
				}

				s.refresh();
			});

			// When clicking outside the graph, getting back to initial state
			// No need to reinit the nodes/edges or to refresh because the handler on actives nodes is doing it
			s.bind('clickStage', function(e){
				activeState.dropNodes(); // Unselect all nodes
				// $('#right-menu-infoUV').html('<p>Aucun noeud sélectionné</p>');
				$('#right-menu').hide();
			});

			// When clicking on a node
			s.bind('clickNode', function (e) {
				if (activeState.nodes().length === 1) { // then the user either click on a another node or click on the same node
					// if the user click on the same node, then we must dismiss the informations
					if (e.data.node === activeState.nodes()[0]) { // here value of activeState.nodes().length is 1
						$('#right-menu').hide();
						// console.log('Déselection du noeud');
						// $('#right-menu-infoUV').html('<p>Aucun noeud sélectionné</p>');
					}
				}
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

	// Unbinding default behavior
  	keyboard.unbind('18+17+65');
	keyboard.unbind('17+85 18+17+85');
	keyboard.unbind('17+46 18+17+46');
	keyboard.unbind('17+69 18+17+69');
	keyboard.unbind('17+73 18+17+73');
	keyboard.unbind('17+76 18+17+76');

	// Initialize the Filter plugin
	filters = sigma.plugins.filter(s);

	// Initialize the Locate plugin
	locate = sigma.plugins.locate(s, {
		zoomDef: 2
	});

	// For the design plugin
	var palette = {
		schemes: {
			nodeTypeScheme: {
				Semestre : 'equilateral',
				UV : 'circle'
			},
			nodeTypeScheme: {
				6 : ['#000', '#000', '#000', '#000', '#000', '#000']
			}
		}
	};

	var styles = {
		nodes: {
			type: {
				by: 'data.properties.categorie',
				scheme: 'schemes.nodeTypeScheme'
			}
		}
	};	

	// Initialize the Design plugin
	design = sigma.plugins.design(s, {
		styles: styles,
		palette: palette
	});

	// Initialize the Legend plugin
	legend = sigma.plugins.legend(s);
	legend.draw();
}

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

			init();
		}
	};

	xhr.send();
}
else {
	init();

	// Disabling some features
	$('#visibility-me').prop('disabled', true);
	$('#visibility-same').prop('disabled', true);
}
