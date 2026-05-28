"""
Graph Generator Module
Generates network graph data from parsed packets using NetworkX
"""

import logging
from collections import defaultdict

try:
    import networkx as nx
    NETWORKX_AVAILABLE = True
except ImportError:
    NETWORKX_AVAILABLE = False
    logging.warning("NetworkX not available. Install with: pip install networkx")

logger = logging.getLogger(__name__)


class GraphGenerator:
    """
    Generate network graph from packet data
    """
    
    def __init__(self, packets_data):
        """
        Initialize generator with packet data
        
        Args:
            packets_data: List of parsed packet dictionaries
        """
        self.packets_data = packets_data
        self.graph = None
        
        if not NETWORKX_AVAILABLE:
            logger.warning("NetworkX not available. Using fallback graph generation.")
    
    def generate_graph(self):
        """
        Generate network graph from packets
        
        Returns:
            Dictionary with nodes and edges for visualization
        """
        try:
            if NETWORKX_AVAILABLE:
                return self._generate_with_networkx()
            else:
                return self._generate_fallback()
                
        except Exception as e:
            logger.error(f"Error generating graph: {str(e)}", exc_info=True)
            raise
    
    def _generate_with_networkx(self):
        """
        Generate graph using NetworkX library
        
        Returns:
            Dictionary with nodes and edges
        """
        logger.info("Generating graph with NetworkX")
        
        # Create directed graph
        G = nx.DiGraph()
        
        # Track connections and traffic
        connections = defaultdict(lambda: {
            'packets': 0,
            'bytes': 0,
            'protocols': set()
        })
        
        node_traffic = defaultdict(lambda: {
            'packets': 0,
            'bytes': 0,
            'protocols': set()
        })
        
        # Process packets
        for packet in self.packets_data:
            src_ip = packet.get('src_ip')
            dst_ip = packet.get('dst_ip')
            protocol = packet.get('protocol_name', 'UNKNOWN')
            length = packet.get('length', 0)
            
            if not src_ip or not dst_ip:
                continue
            
            # Add nodes
            G.add_node(src_ip)
            G.add_node(dst_ip)
            
            # Track connection
            conn_key = (src_ip, dst_ip)
            connections[conn_key]['packets'] += 1
            connections[conn_key]['bytes'] += length
            connections[conn_key]['protocols'].add(protocol)
            
            # Track node traffic
            node_traffic[src_ip]['packets'] += 1
            node_traffic[src_ip]['bytes'] += length
            node_traffic[src_ip]['protocols'].add(protocol)
            
            node_traffic[dst_ip]['packets'] += 1
            node_traffic[dst_ip]['bytes'] += length
            node_traffic[dst_ip]['protocols'].add(protocol)
        
        # Add edges with attributes
        for (src, dst), data in connections.items():
            G.add_edge(
                src, dst,
                packets=data['packets'],
                bytes=data['bytes'],
                protocols=list(data['protocols'])
            )
        
        # Calculate centrality metrics
        try:
            degree_centrality = nx.degree_centrality(G)
            betweenness_centrality = nx.betweenness_centrality(G)
        except:
            degree_centrality = {node: 0 for node in G.nodes()}
            betweenness_centrality = {node: 0 for node in G.nodes()}
        
        # Convert to visualization format
        nodes = []
        for node in G.nodes():
            traffic = node_traffic[node]
            nodes.append({
                'id': node,
                'label': node,
                'packets': traffic['packets'],
                'bytes': traffic['bytes'],
                'protocols': list(traffic['protocols']),
                'degree_centrality': degree_centrality.get(node, 0),
                'betweenness_centrality': betweenness_centrality.get(node, 0),
                'in_degree': G.in_degree(node),
                'out_degree': G.out_degree(node)
            })
        
        edges = []
        for src, dst, data in G.edges(data=True):
            # Determine primary protocol
            protocols = data.get('protocols', [])
            primary_protocol = protocols[0] if protocols else 'UNKNOWN'
            
            edges.append({
                'source': src,
                'target': dst,
                'packets': data.get('packets', 0),
                'bytes': data.get('bytes', 0),
                'protocol': primary_protocol,
                'protocols': protocols
            })
        
        self.graph = G
        
        logger.info(f"Generated graph with {len(nodes)} nodes and {len(edges)} edges")
        
        return {
            'nodes': nodes,
            'edges': edges,
            'stats': {
                'total_nodes': len(nodes),
                'total_edges': len(edges),
                'density': nx.density(G) if len(nodes) > 1 else 0,
                'is_connected': nx.is_weakly_connected(G) if len(nodes) > 0 else False
            }
        }
    
    def _generate_fallback(self):
        """
        Generate graph without NetworkX (fallback method)
        
        Returns:
            Dictionary with nodes and edges
        """
        logger.info("Generating graph with fallback method")
        
        # Track connections
        connections = defaultdict(lambda: {
            'packets': 0,
            'bytes': 0,
            'protocols': set()
        })
        
        node_traffic = defaultdict(lambda: {
            'packets': 0,
            'bytes': 0,
            'protocols': set()
        })
        
        # Process packets
        for packet in self.packets_data:
            src_ip = packet.get('src_ip')
            dst_ip = packet.get('dst_ip')
            protocol = packet.get('protocol_name', 'UNKNOWN')
            length = packet.get('length', 0)
            
            if not src_ip or not dst_ip:
                continue
            
            # Track connection
            conn_key = (src_ip, dst_ip)
            connections[conn_key]['packets'] += 1
            connections[conn_key]['bytes'] += length
            connections[conn_key]['protocols'].add(protocol)
            
            # Track node traffic
            node_traffic[src_ip]['packets'] += 1
            node_traffic[src_ip]['bytes'] += length
            node_traffic[src_ip]['protocols'].add(protocol)
            
            node_traffic[dst_ip]['packets'] += 1
            node_traffic[dst_ip]['bytes'] += length
            node_traffic[dst_ip]['protocols'].add(protocol)
        
        # Create nodes
        nodes = []
        for ip, traffic in node_traffic.items():
            nodes.append({
                'id': ip,
                'label': ip,
                'packets': traffic['packets'],
                'bytes': traffic['bytes'],
                'protocols': list(traffic['protocols'])
            })
        
        # Create edges
        edges = []
        for (src, dst), data in connections.items():
            protocols = list(data['protocols'])
            primary_protocol = protocols[0] if protocols else 'UNKNOWN'
            
            edges.append({
                'source': src,
                'target': dst,
                'packets': data['packets'],
                'bytes': data['bytes'],
                'protocol': primary_protocol,
                'protocols': protocols
            })
        
        logger.info(f"Generated graph with {len(nodes)} nodes and {len(edges)} edges")
        
        return {
            'nodes': nodes,
            'edges': edges,
            'stats': {
                'total_nodes': len(nodes),
                'total_edges': len(edges)
            }
        }
    
    def get_subgraph(self, node_ids):
        """
        Get subgraph containing only specified nodes
        
        Args:
            node_ids: List of node IDs to include
            
        Returns:
            Dictionary with filtered nodes and edges
        """
        if not self.graph:
            raise ValueError("Graph not generated yet. Call generate_graph() first.")
        
        # Create subgraph
        subgraph = self.graph.subgraph(node_ids)
        
        # Convert to visualization format
        nodes = []
        for node in subgraph.nodes():
            node_data = self.graph.nodes[node]
            nodes.append({
                'id': node,
                'label': node,
                **node_data
            })
        
        edges = []
        for src, dst, data in subgraph.edges(data=True):
            edges.append({
                'source': src,
                'target': dst,
                **data
            })
        
        return {
            'nodes': nodes,
            'edges': edges
        }
    
    def find_shortest_path(self, source, target):
        """
        Find shortest path between two nodes
        
        Args:
            source: Source node ID
            target: Target node ID
            
        Returns:
            List of node IDs in the path
        """
        if not self.graph:
            raise ValueError("Graph not generated yet. Call generate_graph() first.")
        
        try:
            path = nx.shortest_path(self.graph, source, target)
            return path
        except nx.NetworkXNoPath:
            return None
    
    def get_central_nodes(self, n=10):
        """
        Get most central nodes in the network
        
        Args:
            n: Number of nodes to return
            
        Returns:
            List of node IDs sorted by centrality
        """
        if not self.graph:
            raise ValueError("Graph not generated yet. Call generate_graph() first.")
        
        centrality = nx.degree_centrality(self.graph)
        sorted_nodes = sorted(
            centrality.items(),
            key=lambda x: x[1],
            reverse=True
        )[:n]
        
        return [node for node, _ in sorted_nodes]


# Example usage
if __name__ == '__main__':
    # Sample packet data for testing
    sample_packets = [
        {
            'src_ip': '192.168.1.1',
            'dst_ip': '192.168.1.2',
            'protocol_name': 'TCP',
            'length': 1500
        },
        {
            'src_ip': '192.168.1.2',
            'dst_ip': '192.168.1.3',
            'protocol_name': 'UDP',
            'length': 500
        },
        {
            'src_ip': '192.168.1.1',
            'dst_ip': '192.168.1.3',
            'protocol_name': 'TCP',
            'length': 1200
        }
    ]
    
    generator = GraphGenerator(sample_packets)
    graph_data = generator.generate_graph()
    
    print(f"\nGenerated graph:")
    print(f"Nodes: {len(graph_data['nodes'])}")
    print(f"Edges: {len(graph_data['edges'])}")
    print(f"\nNodes: {[n['id'] for n in graph_data['nodes']]}")

# Made with Bob
