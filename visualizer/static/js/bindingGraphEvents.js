// Binding on selected nodes change (so on node click)
function bind_graph_ActiveState(aGraph) {
    var s = aGraph.sigmaInstance;
    var activeState = aGraph.graphPlugins.activeState;

    activeState.bind('activeNodes', function() {
        var toKeep = [],
            roots = [];

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
            changeInfobox(aGraph);
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
}


// When clicking outside the graph, getting back to initial state
// No need to reinit the nodes/edges or to refresh because the handler on actives nodes is doing it
function bind_graph_ClickStage(aGraph) {
    var s = aGraph.sigmaInstance;
    var activeState = aGraph.graphPlugins.activeState;

    s.bind('clickStage', function(e){
        activeState.dropNodes(); // Unselect all nodes
        // $('#right-menu-infoUV').html('<p>Aucun noeud sélectionné</p>');
        $('#right-menu').hide();
        $('#right-menu-infoUV ul.collection').empty();
    });
}


// When clicking on a node
function bind_graph_ClickNode(aGraph) {
    var s = aGraph.sigmaInstance;
    var activeState = aGraph.graphPlugins.activeState;

    s.bind('clickNode', function (e) {
        if (activeState.nodes().length === 1) { // then the user either click on a another node or click on the same node
            // if the user click on the same node, then we must dismiss the informations
            if (e.data.node === activeState.nodes()[0]) { // here value of activeState.nodes().length is 1
                $('#right-menu').hide();
                $('#right-menu-infoUV ul.collection').empty();
                // console.log('Déselection du noeud');
                // $('#right-menu-infoUV').html('<p>Aucun noeud sélectionné</p>');
            }
        }
    });
}

// Binding some hover event for a fancy cursor
// Some events of Sigma.js are no longer existing in linkurious.js
function bind_graph_OverNode(aGraph) {
    var s = aGraph.sigmaInstance;

    var node;

    s.bind('hovers', function(e){
        if(e.data.enter.nodes.length != 0){
            $('body').css('cursor', 'pointer');

            // Changing the color of the first node (assume only one can be hovered at the time)
            node = e.data.enter.nodes[0];

            // If the node was disabled, displaying for a while its data
            if(node.disabled){
                node.color = node.originalColor;
                node.label = node.originalLabel;
            }
        }
        else{
            $('body').css('cursor', 'default');

            // Changing the color
            node = e.data.leave.nodes[0];

            // If the node was disabled, hiding its data again
            if(node.disabled){
                node.color = s.settings('disabledColor');
                node.label = s.settings('disabledLabel');
            }
        }

        s.refresh();
    });
}