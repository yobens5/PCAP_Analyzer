/**
 * NetViz - Visualization Module
 * Handles D3.js network graph rendering
 */

// Graph state
let simulation = null;
let svg = null;
let g = null;
let zoom = null;
let currentLayout = 'force';

/**
 * Render network graph using D3.js
 * @param {Object} graphData - Graph data with nodes and edges
 */
function renderGraph(graphData) {
    console.log('Rendering graph:', graphData);
    
    // Clear existing graph
    d3.select('#networkGraph').selectAll('*').remove();
    
    // Get container dimensions
    const container = document.getElementById('graphContainer');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    svg = d3.select('#networkGraph')
        .attr('width', width)
        .attr('height', height);
    
    // Create zoom behavior
    zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Create main group
    g = svg.append('g');
    
    // Create arrow markers for directed edges
    svg.append('defs').selectAll('marker')
        .data(['tcp', 'udp', 'icmp', 'other'])
        .enter().append('marker')
        .attr('id', d => `arrow-${d}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', d => getProtocolColor(d));
    
    // Create force simulation
    simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.edges)
            .id(d => d.id)
            .distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));
    
    // Create links
    const link = g.append('g')
        .selectAll('line')
        .data(graphData.edges)
        .enter().append('line')
        .attr('class', d => `link ${d.protocol.toLowerCase()}`)
        .attr('stroke-width', d => Math.sqrt(d.packets) / 2)
        .attr('marker-end', d => `url(#arrow-${d.protocol.toLowerCase()})`)
        .on('mouseover', handleLinkMouseOver)
        .on('mouseout', handleLinkMouseOut);
    
    // Create nodes
    const node = g.append('g')
        .selectAll('g')
        .data(graphData.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded))
        .on('click', handleNodeClick)
        .on('mouseover', handleNodeMouseOver)
        .on('mouseout', handleNodeMouseOut);
    
    // Add circles to nodes
    node.append('circle')
        .attr('r', d => Math.sqrt(d.packets) + 5)
        .attr('fill', d => getNodeColor(d));
    
    // Add labels to nodes
    node.append('text')
        .text(d => d.label)
        .attr('dy', 4)
        .style('font-size', '10px')
        .style('fill', '#fff');
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Store for later use
    window.graphElements = { svg, g, simulation, link, node };
}

/**
 * Get color for node based on traffic
 */
function getNodeColor(node) {
    const protocols = node.protocols || [];
    
    if (protocols.includes('TCP')) return '#007bff';
    if (protocols.includes('UDP')) return '#28a745';
    if (protocols.includes('ICMP')) return '#ffc107';
    return '#6c757d';
}

/**
 * Get color for protocol
 */
function getProtocolColor(protocol) {
    const colors = {
        'tcp': '#007bff',
        'udp': '#28a745',
        'icmp': '#ffc107',
        'other': '#6c757d'
    };
    return colors[protocol.toLowerCase()] || colors.other;
}

/**
 * Handle node click
 */
function handleNodeClick(event, d) {
    event.stopPropagation();
    showNodeDetails(d);
}

/**
 * Handle node mouse over
 */
function handleNodeMouseOver(event, d) {
    d3.select(event.currentTarget)
        .select('circle')
        .transition()
        .duration(200)
        .attr('r', Math.sqrt(d.packets) + 10)
        .style('filter', 'brightness(1.3)');
}

/**
 * Handle node mouse out
 */
function handleNodeMouseOut(event, d) {
    d3.select(event.currentTarget)
        .select('circle')
        .transition()
        .duration(200)
        .attr('r', Math.sqrt(d.packets) + 5)
        .style('filter', 'brightness(1)');
}

/**
 * Handle link mouse over
 */
function handleLinkMouseOver(event, d) {
    d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr('stroke-width', Math.sqrt(d.packets))
        .style('stroke-opacity', 1);
}

/**
 * Handle link mouse out
 */
function handleLinkMouseOut(event, d) {
    d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr('stroke-width', Math.sqrt(d.packets) / 2)
        .style('stroke-opacity', 0.6);
}

/**
 * Show node details panel
 */
function showNodeDetails(node) {
    const detailsPanel = document.getElementById('nodeDetails');
    const detailsContent = document.getElementById('nodeDetailsContent');
    
    detailsContent.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <div class="detail-row">
                    <span class="detail-label">IP Address:</span>
                    <span class="detail-value">${node.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Packets:</span>
                    <span class="detail-value">${node.packets.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Bytes:</span>
                    <span class="detail-value">${NetViz.formatBytes(node.bytes)}</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="detail-row">
                    <span class="detail-label">Protocols:</span>
                    <span class="detail-value">${node.protocols.join(', ')}</span>
                </div>
                ${node.in_degree !== undefined ? `
                <div class="detail-row">
                    <span class="detail-label">Incoming:</span>
                    <span class="detail-value">${node.in_degree}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Outgoing:</span>
                    <span class="detail-value">${node.out_degree}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    detailsPanel.style.display = 'block';
    detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Drag functions for nodes
 */
function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

/**
 * Zoom graph
 */
function zoomGraph(factor) {
    if (!svg || !zoom) return;
    
    svg.transition()
        .duration(300)
        .call(zoom.scaleBy, factor);
}

/**
 * Reset graph view
 */
function resetGraphView() {
    if (!svg || !zoom) return;
    
    svg.transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity);
}

/**
 * Update graph layout
 */
function updateGraphLayout(layoutType) {
    currentLayout = layoutType;
    
    if (!simulation) return;
    
    const container = document.getElementById('graphContainer');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    switch (layoutType) {
        case 'force':
            simulation
                .force('link', d3.forceLink().id(d => d.id).distance(100))
                .force('charge', d3.forceManyBody().strength(-300))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .alpha(1)
                .restart();
            break;
            
        case 'circular':
            const nodes = simulation.nodes();
            const radius = Math.min(width, height) / 3;
            const angleStep = (2 * Math.PI) / nodes.length;
            
            nodes.forEach((node, i) => {
                node.fx = width / 2 + radius * Math.cos(i * angleStep);
                node.fy = height / 2 + radius * Math.sin(i * angleStep);
            });
            
            simulation.alpha(1).restart();
            break;
            
        case 'hierarchical':
            // Simple hierarchical layout
            const levels = {};
            simulation.nodes().forEach(node => {
                const level = node.in_degree || 0;
                if (!levels[level]) levels[level] = [];
                levels[level].push(node);
            });
            
            Object.keys(levels).forEach((level, i) => {
                const nodesInLevel = levels[level];
                const spacing = width / (nodesInLevel.length + 1);
                nodesInLevel.forEach((node, j) => {
                    node.fx = spacing * (j + 1);
                    node.fy = (height / (Object.keys(levels).length + 1)) * (i + 1);
                });
            });
            
            simulation.alpha(1).restart();
            break;
    }
}

/**
 * Export graph as image
 */
function exportGraphImage() {
    if (!svg) return;
    
    const svgElement = document.getElementById('networkGraph');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'network-graph.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

// Export functions
window.renderGraph = renderGraph;
window.zoomGraph = zoomGraph;
window.resetGraphView = resetGraphView;
window.updateGraphLayout = updateGraphLayout;
window.exportGraphImage = exportGraphImage;

// Made with Bob
