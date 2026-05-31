/**
 * NetViz - API Client
 * Handles all communication with the Flask backend
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Upload PCAP file to server
 * @param {File} file - The PCAP file to upload
 * @returns {Promise<Object>} Upload result
 */
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

/**
 * Get network graph data
 * @param {string} fileId - File identifier
 * @param {string} protocol - Protocol filter (optional)
 * @param {number} minPackets - Minimum packets filter (optional)
 * @returns {Promise<Object>} Graph data with nodes and edges
 */
async function getGraph(fileId, protocol = '', minPackets = 0) {
    try {
        const params = new URLSearchParams();
        if (protocol) params.append('protocol', protocol);
        if (minPackets > 0) params.append('min_packets', minPackets);
        
        const url = `${API_BASE_URL}/graph/${fileId}${params.toString() ? '?' + params.toString() : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch graph');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Graph fetch error:', error);
        throw error;
    }
}

/**
 * Get statistics for a file
 * @param {string} fileId - File identifier
 * @returns {Promise<Object>} Statistics data
 */
async function getStatistics(fileId) {
    try {
        const response = await fetch(`${API_BASE_URL}/stats/${fileId}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch statistics');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Statistics fetch error:', error);
        throw error;
    }
}

/**
 * Get packet data
 * @param {string} fileId - File identifier
 * @param {number} limit - Maximum number of packets
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} Packet data
 */
async function getPackets(fileId, limit = 100, offset = 0) {
    try {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString()
        });
        
        const response = await fetch(`${API_BASE_URL}/packets/${fileId}?${params.toString()}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch packets');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Packets fetch error:', error);
        throw error;
    }
}

/**
 * Get list of all processed files
 * @returns {Promise<Object>} List of files
 */
async function listFiles() {
    try {
        const response = await fetch(`${API_BASE_URL}/files`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch file list');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('File list fetch error:', error);
        throw error;
    }
}

/**
 * Delete a processed file
 * @param {string} fileId - File identifier
 * @returns {Promise<Object>} Deletion result
 */
async function deleteFile(fileId) {
    try {
        const response = await fetch(`${API_BASE_URL}/delete/${fileId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete file');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('File deletion error:', error);
        throw error;
    }
}

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        
        if (!response.ok) {
            throw new Error('API health check failed');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Health check error:', error);
        throw error;
    }
/**
 * List available sample PCAP files
 * @returns {Promise<Object>} List of sample files
 */
async function listSamples() {
    try {
        const response = await fetch(`${API_BASE_URL}/samples`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to list samples');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('List samples error:', error);
        throw error;
    }
}

/**
 * Load a sample PCAP file
 * @param {string} filename - Sample filename to load
 * @returns {Promise<Object>} Processed file data
 */
async function loadSample(filename) {
    try {
        const response = await fetch(`${API_BASE_URL}/load-sample/${filename}`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to load sample');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Load sample error:', error);
        throw error;
    }
}
}

// Export API functions
window.API = {
    uploadFile,
    getGraph,
    getStatistics,
    getPackets,
    listFiles,
    deleteFile,
    checkHealth,
    listSamples,
    loadSample
};

// Made with Bob
