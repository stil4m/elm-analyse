app.ports.updateGraph.subscribe(function(value) {
    displayGraph(value[0], value[1]);
});

app.ports.removeGraph.subscribe(function() {
    removeGraph();
});

const sigmaSettings = {
    minNodeSize: 1,
    maxNodeSize: 10,
    minEdgeSize: 1,
    maxEdgeSize: 1,
    fontStyle: "bold",
    defaultLabelSize: 16,
};


// Add a method to the graph model that returns an
// object with every neighbors of a node inside:
sigma.classes.graph.addMethod('neighbors', function(nodeId) {
    var k,
        neighbors = {},
        index = this.allNeighborsIndex[nodeId] || {};

    for (k in index)
        neighbors[k] = this.nodesIndex[k];

    return neighbors;
});

// we keep a global reference to the graph
// (in order to destroy previous instances)
var graph = null;

/**
 * displayGraph - Displays a graph using sigma.js.
 *
 * @param  {String} elementId The dom element containing the graph.
 * @param  {Object} graphData A graph object as provided from our elm-app.
 */
function displayGraph(elementId, graphData) {
    // prepare data for sigma.js
    // the incoming data is not fully configured for sigma.js
    // the nodes miss size, x, y and label
    // we also add an original color for our click handler
    graphData.nodes.forEach(function(item, index, array) {
        item.size = 1;
        item.color = item.color || "#ec5148"
        item.originalColor = item.color
        item.x = Math.random();
        item.y = Math.random();
        item.label = item.name.join('.');
    });
    graphData.edges.forEach(function(item, index, array) {
        item.color = item.color || "#bbb"
        item.originalColor = item.color
    });

    setTimeout(function() {
        removeGraph();

        // Instantiate sigma with a bit of delay to allow dom to be built up
        var s = new sigma({
            graph: graphData,
            container: elementId,
            settings: sigmaSettings
        });

        s.startForceAtlas2({
            worker: true,
            barnesHutOptimize: false
        });
        sigma.plugins.relativeSize(s, 5);
        addClickHandlers(s);

        window.graph = s;
    }, 250);
}

function removeGraph() {
    if (window.graph === null) {
        return;
    }

    window.graph.graph.clear();
    window.graph.refresh();
    window.graph.kill();
    delete window.graph;
    window.graph = null;
}

/**
 * addClickHandlers - Add click handlers to nodes in order to highlight
 * neighboring nodes. Based on example on http://sigmajs.org
 *
 * @param  {sigma} s Sigma instance.
 */
function addClickHandlers(s) {
    // When a node is clicked, we check for each node
    // if it is a neighbor of the clicked one. If not,
    // we set its color as grey, and else, it takes its
    // original color.
    // We do the same for the edges, and we only keep
    // edges that have both extremities colored.
    s.bind('clickNode', function(e) {
        var nodeId = e.data.node.id,
            toKeep = s.graph.neighbors(nodeId);
        toKeep[nodeId] = e.data.node;
        s.graph.nodes().forEach(function(n) {
            if (toKeep[n.id])
                n.color = n.originalColor;
            else
                n.color = '#ddd';
        });

        s.graph.edges().forEach(function(e) {
            if (toKeep[e.source] && toKeep[e.target])
                e.color = e.originalColor;
            else
                e.color = '#eee';
        });

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        s.refresh();
    });

    // When the stage is clicked, we just color each
    // node and edge with its original color.
    s.bind('clickStage', function(e) {
        s.graph.nodes().forEach(function(n) {
            n.color = n.originalColor;
        });

        s.graph.edges().forEach(function(e) {
            e.color = e.originalColor;
        });

        // Same as in the previous event:
        s.refresh();
    });
}
