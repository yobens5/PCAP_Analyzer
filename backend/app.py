"""
NetViz - PCAP Network Traffic Visualization Tool
Flask Backend Application
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
import logging

# Import our PCAP processing modules
from pcap_parser import PcapParser
from graph_generator import GraphGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pcap', 'pcapng', 'cap'}

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Store processed data in memory (in production, use Redis or database)
processed_files = {}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/')
def index():
    """Serve the main application page"""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })


@app.route('/api/samples', methods=['GET'])
def list_samples():
    """List available sample PCAP files"""
    try:
        sample_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'sample_pcaps')
        samples = []
        
        if os.path.exists(sample_dir):
            for filename in os.listdir(sample_dir):
                if filename.endswith(('.pcap', '.pcapng', '.cap')):
                    filepath = os.path.join(sample_dir, filename)
                    file_size = os.path.getsize(filepath)
                    samples.append({
                        'name': filename,
                        'size': file_size,
                        'size_mb': round(file_size / (1024 * 1024), 2)
                    })
        
        return jsonify({'samples': samples})
    except Exception as e:
        logger.error(f"Error listing samples: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/load-sample/<filename>', methods=['POST'])
def load_sample(filename):
    """Load a sample PCAP file"""
    try:
        # Security: validate filename
        if not filename.endswith(('.pcap', '.pcapng', '.cap')):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Get sample file path
        sample_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'sample_pcaps')
        filepath = os.path.join(sample_dir, secure_filename(filename))
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'Sample file not found'}), 404
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Parse PCAP file
        logger.info(f"Parsing sample PCAP file: {filename}")
        parser = PcapParser(filepath)
        packets = parser.parse()
        
        if not packets:
            return jsonify({'error': 'No packets found in PCAP file'}), 400
        
        # Generate network graph
        logger.info(f"Generating network graph for {len(packets)} packets")
        graph_gen = GraphGenerator(packets)
        graph_data = graph_gen.generate_graph()
        
        # Get statistics
        stats = parser.get_statistics()
        
        # Store processed data
        processed_files[file_id] = {
            'filename': filename,
            'packets': packets,
            'graph': graph_data,
            'stats': stats,
            'timestamp': datetime.now().isoformat(),
            'is_sample': True
        }
        
        logger.info(f"Successfully processed sample file: {filename}")
        
        return jsonify({
            'file_id': file_id,
            'filename': filename,
            'packet_count': len(packets),
            'graph': graph_data,
            'stats': stats
        })
        
    except Exception as e:
        logger.error(f"Error loading sample: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Upload and process a PCAP file
    
    Returns:
        JSON with file_id and basic statistics
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({
                'error': f'Invalid file type. Allowed: {", ".join(app.config["ALLOWED_EXTENSIONS"])}'
            }), 400
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        
        # Save file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}_{filename}")
        file.save(filepath)
        
        logger.info(f"File uploaded: {filename} (ID: {file_id})")
        
        # Parse PCAP file
        parser = PcapParser(filepath)
        packets_data = parser.parse()
        
        # Generate network graph
        graph_gen = GraphGenerator(packets_data)
        graph_data = graph_gen.generate_graph()
        
        # Calculate statistics
        stats = parser.get_statistics()
        
        # Store processed data
        processed_files[file_id] = {
            'filename': filename,
            'filepath': filepath,
            'upload_time': datetime.now().isoformat(),
            'packets_data': packets_data,
            'graph_data': graph_data,
            'stats': stats
        }
        
        logger.info(f"File processed: {filename} - {stats['total_packets']} packets")
        
        return jsonify({
            'success': True,
            'file_id': file_id,
            'filename': filename,
            'size': os.path.getsize(filepath),
            'packets': stats['total_packets'],
            'duration': stats.get('duration', 0),
            'protocols': stats.get('protocols', {})
        })
        
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500


@app.route('/api/graph/<file_id>', methods=['GET'])
def get_graph(file_id):
    """
    Get network graph data for a processed file
    
    Args:
        file_id: Unique file identifier
        
    Query Parameters:
        protocol: Filter by protocol (tcp, udp, icmp)
        min_packets: Minimum packets threshold
        
    Returns:
        JSON with nodes and edges
    """
    try:
        if file_id not in processed_files:
            return jsonify({'error': 'File not found'}), 404
        
        graph_data = processed_files[file_id]['graph_data']
        
        # Apply filters if provided
        protocol_filter = request.args.get('protocol', '').upper()
        min_packets = int(request.args.get('min_packets', 0))
        
        if protocol_filter or min_packets > 0:
            graph_data = apply_filters(graph_data, protocol_filter, min_packets)
        
        return jsonify(graph_data)
        
    except Exception as e:
        logger.error(f"Error retrieving graph: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error retrieving graph: {str(e)}'}), 500


@app.route('/api/stats/<file_id>', methods=['GET'])
def get_statistics(file_id):
    """
    Get detailed statistics for a processed file
    
    Args:
        file_id: Unique file identifier
        
    Returns:
        JSON with comprehensive statistics
    """
    try:
        if file_id not in processed_files:
            return jsonify({'error': 'File not found'}), 404
        
        stats = processed_files[file_id]['stats']
        
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Error retrieving statistics: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error retrieving statistics: {str(e)}'}), 500


@app.route('/api/packets/<file_id>', methods=['GET'])
def get_packets(file_id):
    """
    Get raw packet data for a processed file
    
    Args:
        file_id: Unique file identifier
        
    Query Parameters:
        limit: Maximum number of packets to return (default: 100)
        offset: Offset for pagination (default: 0)
        
    Returns:
        JSON with packet details
    """
    try:
        if file_id not in processed_files:
            return jsonify({'error': 'File not found'}), 404
        
        packets_data = processed_files[file_id]['packets_data']
        
        # Pagination
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        
        paginated_packets = packets_data[offset:offset + limit]
        
        return jsonify({
            'packets': paginated_packets,
            'total': len(packets_data),
            'limit': limit,
            'offset': offset
        })
        
    except Exception as e:
        logger.error(f"Error retrieving packets: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error retrieving packets: {str(e)}'}), 500


@app.route('/api/files', methods=['GET'])
def list_files():
    """
    List all processed files
    
    Returns:
        JSON with list of files and their metadata
    """
    try:
        files_list = []
        for file_id, data in processed_files.items():
            files_list.append({
                'file_id': file_id,
                'filename': data['filename'],
                'upload_time': data['upload_time'],
                'packets': data['stats']['total_packets'],
                'size': os.path.getsize(data['filepath'])
            })
        
        return jsonify({'files': files_list})
        
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error listing files: {str(e)}'}), 500


@app.route('/api/delete/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    """
    Delete a processed file and its data
    
    Args:
        file_id: Unique file identifier
        
    Returns:
        JSON with success status
    """
    try:
        if file_id not in processed_files:
            return jsonify({'error': 'File not found'}), 404
        
        # Delete physical file
        filepath = processed_files[file_id]['filepath']
        if os.path.exists(filepath):
            os.remove(filepath)
        
        # Remove from memory
        del processed_files[file_id]
        
        logger.info(f"File deleted: {file_id}")
        
        return jsonify({'success': True, 'message': 'File deleted successfully'})
        
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error deleting file: {str(e)}'}), 500


def apply_filters(graph_data, protocol_filter, min_packets):
    """
    Apply filters to graph data
    
    Args:
        graph_data: Original graph data
        protocol_filter: Protocol to filter by
        min_packets: Minimum packet threshold
        
    Returns:
        Filtered graph data
    """
    filtered_nodes = []
    filtered_edges = []
    
    # Filter edges
    for edge in graph_data['edges']:
        if protocol_filter and edge['protocol'] != protocol_filter:
            continue
        if edge['packets'] < min_packets:
            continue
        filtered_edges.append(edge)
    
    # Get nodes that are referenced in filtered edges
    referenced_nodes = set()
    for edge in filtered_edges:
        referenced_nodes.add(edge['source'])
        referenced_nodes.add(edge['target'])
    
    # Filter nodes
    for node in graph_data['nodes']:
        if node['id'] in referenced_nodes:
            filtered_nodes.append(node)
    
    return {
        'nodes': filtered_nodes,
        'edges': filtered_edges
    }


@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({
        'error': 'File too large. Maximum size is 100MB'
    }), 413


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}", exc_info=True)
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Run the application
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True
    )

# Made with Bob
