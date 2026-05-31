/**
 * NetViz - Main JavaScript
 * Handles file upload, UI coordination, and user interactions
 */

// Global state
let currentFileId = null;
let currentGraphData = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('NetViz initialized');
    
    initializeUpload();
    initializeFilters();
    initializeControls();
    
    // Check API health
    checkAPIHealth();
});

/**
 * Check if backend API is available
 */
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        console.log('API Health:', data);
    } catch (error) {
        console.error('API not available:', error);
        showNotification('Backend API is not running. Please start the Flask server.', 'warning');
    }
}

/**
 * Initialize file upload functionality
 */
function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    // Click to upload - only on the drag area itself, not child elements
    uploadArea.addEventListener('click', (e) => {
        // Don't trigger if clicking on sample files section
        if (!e.target.closest('.sample-files-section')) {
            fileInput.click();
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
}

/**
 * Handle file upload
 */
async function handleFileUpload(file) {
    // Validate file type
    const validExtensions = ['pcap', 'pcapng', 'cap'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
        showNotification(`Invalid file type. Please upload a PCAP file (.${validExtensions.join(', .')})`, 'danger');
        return;
    }
    
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
        showNotification('File too large. Maximum size is 100MB', 'danger');
        return;
    }
    
    // Show progress
    showUploadProgress();
    
    try {
        // Upload file
        const result = await uploadFile(file);
        
        if (result.success) {
            currentFileId = result.file_id;
            
            // Show file info
            showFileInfo(result);
            
            // Load and display graph
            await loadGraph(result.file_id);
            
            // Load and display statistics
            await loadStatistics(result.file_id);
            
            // Show visualization and statistics sections
            document.getElementById('visualization').style.display = 'block';
            document.getElementById('statistics').style.display = 'block';
            
            // Scroll to visualization
            document.getElementById('visualization').scrollIntoView({ behavior: 'smooth' });
            
            showNotification('File processed successfully!', 'success');
        } else {
            throw new Error(result.error || 'Upload failed');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        showNotification(`Error: ${error.message}`, 'danger');
    } finally {
        hideUploadProgress();
    }
}

/**
 * Show upload progress
 */
function showUploadProgress() {
    document.getElementById('uploadProgress').style.display = 'block';
    document.getElementById('fileInfo').style.display = 'none';
    
    // Simulate progress (in real app, use actual upload progress)
    let progress = 0;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        
        if (progress < 50) {
            progressText.textContent = 'Uploading...';
        } else if (progress < 80) {
            progressText.textContent = 'Processing...';
        } else {
            progressText.textContent = 'Analyzing...';
        }
        
        if (progress >= 90) {
            clearInterval(interval);
        }
    }, 200);
}

/**
 * Hide upload progress
 */
function hideUploadProgress() {
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('progressBar').style.width = '0%';
}

/**
 * Show file information
 */
function showFileInfo(fileData) {
    const fileInfo = document.getElementById('fileInfo');
    const fileDetails = document.getElementById('fileDetails');
    
    fileDetails.innerHTML = `
        <div class="row g-2 mt-2">
            <div class="col-md-6">
                <strong>Filename:</strong> ${fileData.filename}
            </div>
            <div class="col-md-6">
                <strong>Size:</strong> ${formatBytes(fileData.size)}
            </div>
            <div class="col-md-6">
                <strong>Packets:</strong> ${fileData.packets.toLocaleString()}
            </div>
            <div class="col-md-6">
                <strong>Duration:</strong> ${fileData.duration}s
            </div>
        </div>
    `;
    
    fileInfo.style.display = 'block';
}

/**
 * Initialize filter controls
 */
function initializeFilters() {
    const protocolFilter = document.getElementById('protocolFilter');
    const minPackets = document.getElementById('minPackets');
    const minPacketsValue = document.getElementById('minPacketsValue');
    const layoutType = document.getElementById('layoutType');
    
    // Protocol filter
    protocolFilter.addEventListener('change', () => {
        if (currentFileId) {
            loadGraph(currentFileId);
        }
    });
    
    // Min packets filter
    minPackets.addEventListener('input', (e) => {
        minPacketsValue.textContent = e.target.value;
    });
    
    minPackets.addEventListener('change', () => {
        if (currentFileId) {
            loadGraph(currentFileId);
        }
    });
    
    // Layout type
    layoutType.addEventListener('change', () => {
        if (currentGraphData) {
            updateGraphLayout(layoutType.value);
        }
    });
}

/**
 * Initialize graph controls
 */
function initializeControls() {
    document.getElementById('zoomIn').addEventListener('click', () => {
        zoomIn();
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
        zoomOut();
    });
    
    document.getElementById('resetZoom').addEventListener('click', () => {
        resetView();
    });
    
    document.getElementById('exportGraph').addEventListener('click', () => {
        exportGraph();
    });
}

/**
 * Load and display network graph
 */
async function loadGraph(fileId) {
    try {
        // Get filter values
        const protocol = document.getElementById('protocolFilter').value;
        const minPackets = document.getElementById('minPackets').value;
        
        // Fetch graph data
        const graphData = await getGraph(fileId, protocol, minPackets);
        currentGraphData = graphData;
        
        // Render graph
        renderGraph(graphData);
        
    } catch (error) {
        console.error('Error loading graph:', error);
        showNotification('Error loading graph visualization', 'danger');
    }
}

/**
 * Load and display statistics
 */
async function loadStatistics(fileId) {
    try {
        const stats = await getStatistics(fileId);
        displayStatistics(stats);
    } catch (error) {
        console.error('Error loading statistics:', error);
        showNotification('Error loading statistics', 'danger');
    }
}

/**
 * Display statistics
 */
function displayStatistics(stats) {
    // Update summary cards - Row 1
    document.getElementById('totalPackets').textContent = stats.total_packets.toLocaleString();
    document.getElementById('totalBytes').textContent = formatBytes(stats.total_bytes);
    document.getElementById('uniqueIPs').textContent = stats.unique_ips;
    document.getElementById('duration').textContent = `${stats.duration}s`;
    
    // Update summary cards - Row 2 (New KPIs)
    const avgPacketSize = stats.total_packets > 0 ? Math.round(stats.total_bytes / stats.total_packets) : 0;
    document.getElementById('avgPacketSize').textContent = formatBytes(avgPacketSize);
    
    const packetsPerSecond = stats.duration > 0 ? Math.round(stats.total_packets / stats.duration) : 0;
    document.getElementById('packetsPerSecond').textContent = packetsPerSecond.toLocaleString();
    
    // Count total connections (edges in graph)
    const totalConnections = stats.top_talkers ? stats.top_talkers.length : 0;
    document.getElementById('totalConnections').textContent = totalConnections;
    
    // Count unique protocols
    const protocolCount = Object.keys(stats.protocols || {}).length;
    document.getElementById('protocolCount').textContent = protocolCount;
    
    // Display protocol chart
    displayProtocolChart(stats.protocols);
    
    // Display top talkers
    displayTopTalkers(stats.top_talkers || []);
}

/**
 * Display protocol distribution chart
 */
function displayProtocolChart(protocols) {
    const ctx = document.getElementById('protocolChart').getContext('2d');
    
    // Destroy existing chart if any
    if (window.protocolChart) {
        window.protocolChart.destroy();
    }
    
    const labels = Object.keys(protocols);
    const data = Object.values(protocols);
    const colors = [
        '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6c757d'
    ];
    
    window.protocolChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Display top talkers
 */
function displayTopTalkers(topTalkers) {
    const container = document.getElementById('topTalkers');
    
    if (topTalkers.length === 0) {
        container.innerHTML = '<p class="text-muted">No data available</p>';
        return;
    }
    
    container.innerHTML = topTalkers.map((talker, index) => `
        <div class="list-group-item">
            <div>
                <span class="badge bg-primary me-2">${index + 1}</span>
                <span class="talker-ip">${talker.ip}</span>
            </div>
            <div class="talker-traffic">
                ${formatBytes(talker.total)}
            </div>
        </div>
    `).join('');
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Export functions for use in other modules
window.NetViz = {
    showNotification,
    formatBytes,
    formatNumber,
    currentFileId: () => currentFileId,
    currentGraphData: () => currentGraphData
};

// Made with Bob

/**
 * Load and display sample PCAP files
 */
async function loadSampleFiles() {
    const sampleFilesList = document.getElementById('sampleFilesList');
    
    try {
        const response = await fetch(`${API_BASE_URL}/samples`);
        const data = await response.json();
        
        if (data.samples && data.samples.length > 0) {
            sampleFilesList.innerHTML = '';
            
            data.samples.forEach(sample => {
                const col = document.createElement('div');
                col.className = 'col-md-6';
                
                col.innerHTML = `
                    <div class="sample-file-card" onclick="handleSampleFileClick('${sample.name}', event)">
                        <div class="text-center">
                            <div class="sample-file-icon">
                                <i class="fas fa-file-archive"></i>
                            </div>
                            <div class="sample-file-name">${sample.name}</div>
                            <div class="sample-file-size">${sample.size_mb} MB</div>
                            <button class="btn btn-sm btn-primary mt-2">
                                <i class="fas fa-play me-1"></i>
                                Load Sample
                            </button>
                        </div>
                    </div>
                `;
                
                sampleFilesList.appendChild(col);
            });
        } else {
            sampleFilesList.innerHTML = `
                <div class="col-12 text-center text-muted">
                    <i class="fas fa-info-circle me-2"></i>
                    No sample files available
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading samples:', error);
        sampleFilesList.innerHTML = `
            <div class="col-12 text-center text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load sample files
            </div>
        `;
    }
}

/**
 * Handle sample file click
 */
async function handleSampleFileClick(filename, event) {
    event.stopPropagation();
    event.preventDefault();
    
    const card = event.currentTarget;
    card.classList.add('loading');
    
    try {
        showNotification(`Loading ${filename}...`, 'info');
        
        // Show progress
        const progressDiv = document.getElementById('uploadProgress');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressDiv.style.display = 'block';
        progressBar.style.width = '50%';
        progressText.textContent = 'Processing sample file...';
        
        // Load sample file
        const response = await fetch(`${API_BASE_URL}/load-sample/${filename}`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load sample');
        }
        
        // Update progress
        progressBar.style.width = '100%';
        progressText.textContent = 'Complete!';
        
        // Store data
        currentFileId = data.file_id;
        currentGraphData = data.graph;
        
        // Display results
        displayFileInfo(data);
        renderGraph(data.graph);
        displayStatistics(data.stats);
        
        // Hide progress after delay
        setTimeout(() => {
            progressDiv.style.display = 'none';
            progressBar.style.width = '0%';
        }, 1000);
        
        showNotification(`Successfully loaded ${filename}`, 'success');
        
    } catch (error) {
        console.error('Error loading sample:', error);
        showNotification(`Failed to load ${filename}: ${error.message}`, 'danger');
        
        const progressDiv = document.getElementById('uploadProgress');
        progressDiv.style.display = 'none';
    } finally {
        card.classList.remove('loading');
    }
}
