/**
 * NetViz - Visualization Module (Cytoscape.js)
 * Modern graph visualization with Cytoscape.js
 */

// Graph state
let cy = null;
let currentLayout = 'cose';

/**
 * Render network graph using Cytoscape.js
 * @param {Object} graphData - Graph data with nodes and edges
 */
function renderGraph(graphData) {
    console.log('Rendering graph with Cytoscape:', graphData);
    
    // Check if Cytoscape is loaded
    if (typeof cytoscape === 'undefined') {
        console.error('Cytoscape.js is not loaded!');
        showNotification('Error: Cytoscape.js library not loaded', 'danger');
        return;
    }
    
    // Clear existing graph
    if (cy) {
        cy.destroy();
    }
    
    // Transform data for Cytoscape format
    const elements = [];
    
    // Add nodes
    graphData.nodes.forEach(node => {
        elements.push({
            data: {
                id: node.id,
                label: node.label || node.id,
                packets: node.packets || 0,
                degree: node.degree || 0
            }
        });
    });
    
    // Add edges
    graphData.edges.forEach(edge => {
        elements.push({
            data: {
                id: `${edge.source}-${edge.target}`,
                source: edge.source,
                target: edge.target,
                protocol: edge.protocol || 'TCP',
                packets: edge.packets || 1
            }
        });
    });
    
    // Initialize Cytoscape
    cy = cytoscape({
        container: document.getElementById('networkGraph'),
        
        elements: elements,
        
        style: [
            // Node styles
            {
                selector: 'node',
                style: {
                    'background-color': '#4A90E2',
                    'label': 'data(label)',
                    'width': 'mapData(packets, 0, 10000, 20, 60)',
                    'height': 'mapData(packets, 0, 10000, 20, 60)',
                    'font-size': '12px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'text-outline-width': 2,
                    'text-outline-color': '#4A90E2',
                    'overlay-padding': '6px',
                    'z-index': 10
                }
            },
            // Node hover
            {
                selector: 'node:selected',
                style: {
                    'border-width': 3,
                    'border-color': '#FFA500',
                    'background-color': '#FF6B6B'
                }
            },
            // Edge styles - TCP
            {
                selector: 'edge[protocol = "TCP"]',
                style: {
                    'width': 'mapData(packets, 0, 1000, 1, 5)',
                    'line-color': '#4A90E2',
                    'target-arrow-color': '#4A90E2',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'arrow-scale': 1,
                    'opacity': 0.6
                }
            },
            // Edge styles - UDP
            {
                selector: 'edge[protocol = "UDP"]',
                style: {
                    'width': 'mapData(packets, 0, 1000, 1, 5)',
                    'line-color': '#50C878',
                    'target-arrow-color': '#50C878',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'arrow-scale': 1,
                    'opacity': 0.6
                }
            },
            // Edge styles - ICMP
            {
                selector: 'edge[protocol = "ICMP"]',
                style: {
                    'width': 'mapData(packets, 0, 1000, 1, 5)',
                    'line-color': '#FF6B6B',
                    'target-arrow-color': '#FF6B6B',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'arrow-scale': 1,
                    'opacity': 0.6
                }
            },
            // Edge styles - ARP
            {
                selector: 'edge[protocol = "ARP"]',
                style: {
                    'width': 'mapData(packets, 0, 1000, 1, 5)',
                    'line-color': '#FFD700',
                    'target-arrow-color': '#FFD700',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'arrow-scale': 1,
                    'opacity': 0.6
                }
            },
            // Edge hover
            {
                selector: 'edge:selected',
                style: {
                    'width': 4,
                    'opacity': 1,
                    'z-index': 9999
                }
            }
        ],
        
        layout: {
            name: 'cose',
            animate: true,
            animationDuration: 1000,
            nodeRepulsion: 20000,        // Increased from 8000 to 20000
            idealEdgeLength: 200,         // Increased from 100 to 200
            edgeElasticity: 100,
            nestingFactor: 5,
            gravity: 50,                  // Reduced from 80 to 50
            numIter: 1000,
            initialTemp: 200,
            coolingFactor: 0.95,
            minTemp: 1.0
        },
        
        minZoom: 0.1,
        maxZoom: 3,
        wheelSensitivity: 0.2
    });
    
    // Add node click event
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        const data = node.data();
        
        showNotification(
            `IP: ${data.label}<br>Packets: ${data.packets}<br>Connections: ${data.degree}`,
            'info'
        );
    });
    
    // Add edge click event
    cy.on('tap', 'edge', function(evt) {
        const edge = evt.target;
        const data = edge.data();
        
        showNotification(
            `${data.source} → ${data.target}<br>Protocol: ${data.protocol}<br>Packets: ${data.packets}`,
            'info'
        );
    });
    
    // Show visualization section
    document.getElementById('visualization').style.display = 'block';
    
    // Scroll to visualization
    document.getElementById('visualization').scrollIntoView({ behavior: 'smooth' });
    
    console.log('Graph rendered successfully with Cytoscape');
}

/**
 * Zoom in on graph
 */
function zoomIn() {
    if (cy) {
        cy.zoom(cy.zoom() * 1.2);
        cy.center();
    }
}

/**
 * Zoom out on graph
 */
function zoomOut() {
    if (cy) {
        cy.zoom(cy.zoom() * 0.8);
        cy.center();
    }
}

/**
 * Reset graph view
 */
function resetView() {
    if (cy) {
        cy.fit();
        cy.center();
    }
}

/**
 * Change graph layout
 * @param {string} layoutName - Layout name (cose, circle, grid, breadthfirst)
 */
function changeLayout(layoutName) {
    if (!cy) return;
    
    currentLayout = layoutName;
    
    const layoutOptions = {
        name: layoutName,
        animate: true,
        animationDuration: 1000
    };
    
    // Add specific options for each layout
    if (layoutName === 'cose') {
        layoutOptions.nodeRepulsion = 8000;
        layoutOptions.idealEdgeLength = 100;
        layoutOptions.edgeElasticity = 100;
        layoutOptions.gravity = 80;
    } else if (layoutName === 'circle') {
        layoutOptions.radius = 200;
    } else if (layoutName === 'grid') {
        layoutOptions.rows = Math.ceil(Math.sqrt(cy.nodes().length));
    }
    
    cy.layout(layoutOptions).run();
}

/**
 * Filter graph by protocol
 * @param {string} protocol - Protocol to filter (TCP, UDP, ICMP, ARP, or empty for all)
 */
function filterByProtocol(protocol) {
    if (!cy) return;
    
    if (protocol === '') {
        // Show all
        cy.elements().style('display', 'element');
    } else {
        // Hide all edges first
        cy.edges().style('display', 'none');
        
        // Show only edges with selected protocol
        cy.edges(`[protocol = "${protocol}"]`).style('display', 'element');
        
        // Show nodes that have visible edges
        const visibleNodes = cy.edges(':visible').connectedNodes();
        cy.nodes().style('display', 'none');
        visibleNodes.style('display', 'element');
    }
}

/**
 * Export graph as image
 */
function exportGraph() {
    if (!cy) return;
    
    const png = cy.png({
        output: 'blob',
        bg: '#ffffff',
        full: true,
        scale: 2
    });
    
    const url = URL.createObjectURL(png);
    const link = document.createElement('a');
    link.href = url;
    link.download = `network-graph-${Date.now()}.png`;
    link.click();
    
    showNotification('Graph exported successfully!', 'success');
}

// Export functions
window.renderGraph = renderGraph;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetView = resetView;
window.changeLayout = changeLayout;
window.filterByProtocol = filterByProtocol;
window.exportGraph = exportGraph;

// Made with Bob
