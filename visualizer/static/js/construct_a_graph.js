
function nodeInit (aGraph, n) {
    aGraph.tagsForSearchBar.push(n.id); // add tags for the autocomplete search
    n.originalColor = n.color;
    n.originalLabel = n.label;
    n.disabled = false;

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

function init_a_graph(graphName, jsonFilePath, userUVs, callback){

    var aGraph = {
        sigmaInstance : undefined,
        graphPlugins : {
            activeState : undefined,
            select : undefined,
            keyboard : undefined,
            filters : undefined,
            locate : undefined,
            design : undefined,
            legend : undefined
        },
        graphName : undefined,
        pathToJsonFile : undefined,
        tagsForSearchBar : []
    };


    // Change renderer
    sigma.renderers.def = sigma.renderers.canvas;

    aGraph.graphName = graphName;
    aGraph.pathToJsonFile = jsonFilePath;
    aGraph.tagsForSearchBar = [
        'GI', //  - Génie Informatique
        'GB', // Génie Biologique
        'GM', // Génie Mécanique
        'GSM', // Génie des Systèmes Mécaniques
        'GP', // Génie des Procédés
        'TC', // Tronc Commun
        'GSU' // Génie des Systèmes Urbains
    ];

    // Instantiate sigma:
    aGraph.sigmaInstance = new sigma({
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
    renderGlyphs(aGraph);
    renderHalo(aGraph, userUVs);

    aGraph.sigmaInstance.renderers[0].bind('render', function() {
        renderGlyphs(aGraph);
        renderHalo(aGraph, userUVs);
    });

    // Change angle of the camera to get the graph on the right place
    sigma.misc.animation.camera(aGraph.sigmaInstance.camera, {angle: Math.PI});

    // Load graph
    sigma.parsers.json(
        aGraph.pathToJsonFile,
        aGraph.sigmaInstance,
        function(){ /* callback function : the init_a_graph() function really ends at the end of this callback function*/ 
            var s = aGraph.sigmaInstance;

            // Saving the color and label then initializing
            // s.graph.nodes().forEach(nodeInit(aGraph));
            s.graph.nodes().forEach(function (item) {
                nodeInit(aGraph, item);
            });
            aGraph.tagsForSearchBar.sort(); // sort the array containing the tags for the autocomplete search bar

            s.graph.edges().forEach(linkInit);

            // Binding on selected nodes change (so on node click)
            bind_graph_ActiveState(aGraph);


            // When clicking outside the graph, getting back to initial state
            // No need to reinit the nodes/edges or to refresh because the handler on actives nodes is doing it
            bind_graph_ClickStage(aGraph);

            // When clicking on a node
            bind_graph_ClickNode(aGraph);

            // Binding some hover event for a fancy cursor
            // Some events of Sigma.js are no longer existing in linkurious.js
            bind_graph_OverNode(aGraph);

            // s.refresh();
            callback(aGraph); // return the graph created in the init_a_graph() function to the callback function in the main.js
        });

    // Instanciate the ActiveState plugin:
    init_activeState_plugin(aGraph);

    // Initialize the Select plugin:
    init_select_plugin(aGraph);

    // Initialize the Keyboard plugin:
    init_keyboard_plugin(aGraph);

    // Initialize the Filter plugin
    init_filter_plugin(aGraph);

    // Initialize the Locate plugin
    init_locate_plugin(aGraph);

    // Initialize the design plugin
    init_design_plugin(aGraph);

    // Initialize the Legend plugin
    init_legend_plugin(aGraph);




}

// Functions that initialize the sigma plugins

// Instanciate the ActiveState plugin:
function init_activeState_plugin(aGraph) {
    aGraph.graphPlugins.activeState = sigma.plugins.activeState(aGraph.sigmaInstance);
}

// Initialize the Select plugin:
function init_select_plugin(aGraph) {
    aGraph.graphPlugins.select = sigma.plugins.select(aGraph.sigmaInstance,
        aGraph.graphPlugins.activeState,
        aGraph.sigmaInstance.renderers[0]);
}

// Initialize the Keyboard plugin:
function init_keyboard_plugin(aGraph) {
    aGraph.graphPlugins.keyboard = sigma.plugins.keyboard(aGraph.sigmaInstance, aGraph.sigmaInstance.renderers[0], {
        displacement: -100 // Coded upside down so get it right
    });
    // Bind the Keyboard plugin to the Select plugin:
    aGraph.graphPlugins.select.bindKeyboard(aGraph.graphPlugins.keyboard);
// Unbinding default behavior
    aGraph.graphPlugins.keyboard.unbind('18+17+65');
    aGraph.graphPlugins.keyboard.unbind('17+85 18+17+85');
    aGraph.graphPlugins.keyboard.unbind('17+46 18+17+46');
    aGraph.graphPlugins.keyboard.unbind('17+69 18+17+69');
    aGraph.graphPlugins.keyboard.unbind('17+73 18+17+73');
    aGraph.graphPlugins.keyboard.unbind('17+76 18+17+76');

}


// Initialize the design plugin
function init_design_plugin (aGraph) {
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
    aGraph.graphPlugins.design = sigma.plugins.design(aGraph.sigmaInstance, {
        styles: styles,
        palette: palette
    });
}

function init_filter_plugin(aGraph) {
    aGraph.graphPlugins.filters = sigma.plugins.filter(aGraph['sigmaInstance']);
}

function init_locate_plugin(aGraph) {
    aGraph.graphPlugins.locate = sigma.plugins.locate(aGraph.sigmaInstance, {
        zoomDef: 2
    });
}

function init_legend_plugin(aGraph) {
    aGraph.graphPlugins.legend = sigma.plugins.legend(aGraph.sigmaInstance);
    aGraph.graphPlugins.legend.draw();
}