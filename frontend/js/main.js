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
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
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
        zoomGraph(1.2);
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
        zoomGraph(0.8);
    });
    
    document.getElementById('resetZoom').addEventListener('click', () => {
        resetGraphView();
    });
    
    document.getElementById('exportGraph').addEventListener('click', () => {
        exportGraphImage();
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
    // Update summary cards
    document.getElementById('totalPackets').textContent = stats.total_packets.toLocaleString();
    document.getElementById('totalBytes').textContent = formatBytes(stats.total_bytes);
    document.getElementById('uniqueIPs').textContent = stats.unique_ips;
    document.getElementById('duration').textContent = `${stats.duration}s`;
    
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
