"""
PCAP Parser Module
Handles parsing of PCAP files using Scapy
"""

import logging
from datetime import datetime
from collections import defaultdict

try:
    from scapy.all import rdpcap, IP, TCP, UDP, ICMP, ARP
    SCAPY_AVAILABLE = True
except ImportError:
    SCAPY_AVAILABLE = False
    logging.warning("Scapy not available. Install with: pip install scapy")

logger = logging.getLogger(__name__)


class PcapParser:
    """
    Parse PCAP files and extract network traffic information
    """
    
    def __init__(self, filepath):
        """
        Initialize parser with PCAP file path
        
        Args:
            filepath: Path to PCAP file
        """
        self.filepath = filepath
        self.packets = []
        self.statistics = {}
        
        if not SCAPY_AVAILABLE:
            raise ImportError("Scapy is required for PCAP parsing. Install with: pip install scapy")
    
    def parse(self):
        """
        Parse the PCAP file and extract packet information
        
        Returns:
            List of packet dictionaries
        """
        try:
            logger.info(f"Parsing PCAP file: {self.filepath}")
            
            # Read PCAP file
            packets = rdpcap(self.filepath)
            
            logger.info(f"Read {len(packets)} packets from file")
            
            # Process each packet
            parsed_packets = []
            for i, packet in enumerate(packets):
                parsed_packet = self._parse_packet(packet, i)
                if parsed_packet:
                    parsed_packets.append(parsed_packet)
            
            self.packets = parsed_packets
            self._calculate_statistics()
            
            logger.info(f"Successfully parsed {len(parsed_packets)} packets")
            
            return parsed_packets
            
        except Exception as e:
            logger.error(f"Error parsing PCAP file: {str(e)}", exc_info=True)
            raise
    
    def _parse_packet(self, packet, index):
        """
        Parse individual packet
        
        Args:
            packet: Scapy packet object
            index: Packet index
            
        Returns:
            Dictionary with packet information
        """
        try:
            packet_info = {
                'index': index,
                'timestamp': float(packet.time),
                'length': len(packet)
            }
            
            # Extract IP layer information
            if IP in packet:
                packet_info.update({
                    'src_ip': packet[IP].src,
                    'dst_ip': packet[IP].dst,
                    'protocol': packet[IP].proto,
                    'ttl': packet[IP].ttl
                })
                
                # Extract TCP information
                if TCP in packet:
                    packet_info.update({
                        'protocol_name': 'TCP',
                        'src_port': packet[TCP].sport,
                        'dst_port': packet[TCP].dport,
                        'flags': str(packet[TCP].flags),
                        'seq': packet[TCP].seq,
                        'ack': packet[TCP].ack
                    })
                
                # Extract UDP information
                elif UDP in packet:
                    packet_info.update({
                        'protocol_name': 'UDP',
                        'src_port': packet[UDP].sport,
                        'dst_port': packet[UDP].dport,
                        'length': packet[UDP].len
                    })
                
                # Extract ICMP information
                elif ICMP in packet:
                    packet_info.update({
                        'protocol_name': 'ICMP',
                        'type': packet[ICMP].type,
                        'code': packet[ICMP].code
                    })
                
                else:
                    packet_info['protocol_name'] = 'OTHER'
            
            # Handle ARP packets
            elif ARP in packet:
                packet_info.update({
                    'protocol_name': 'ARP',
                    'src_ip': packet[ARP].psrc,
                    'dst_ip': packet[ARP].pdst,
                    'operation': packet[ARP].op
                })
            
            else:
                # Skip non-IP packets
                return None
            
            return packet_info
            
        except Exception as e:
            logger.warning(f"Error parsing packet {index}: {str(e)}")
            return None
    
    def _calculate_statistics(self):
        """
        Calculate statistics from parsed packets
        """
        if not self.packets:
            self.statistics = {
                'total_packets': 0,
                'total_bytes': 0,
                'protocols': {},
                'unique_ips': 0,
                'duration': 0
            }
            return
        
        # Initialize counters
        protocol_counts = defaultdict(int)
        total_bytes = 0
        unique_ips = set()
        timestamps = []
        
        # Process packets
        for packet in self.packets:
            # Count protocols
            protocol = packet.get('protocol_name', 'UNKNOWN')
            protocol_counts[protocol] += 1
            
            # Sum bytes
            total_bytes += packet.get('length', 0)
            
            # Collect unique IPs
            if 'src_ip' in packet:
                unique_ips.add(packet['src_ip'])
            if 'dst_ip' in packet:
                unique_ips.add(packet['dst_ip'])
            
            # Collect timestamps
            if 'timestamp' in packet:
                timestamps.append(packet['timestamp'])
        
        # Calculate duration
        duration = 0
        if timestamps:
            duration = max(timestamps) - min(timestamps)
        
        # Calculate top talkers
        ip_traffic = defaultdict(lambda: {'sent': 0, 'received': 0, 'total': 0})
        for packet in self.packets:
            if 'src_ip' in packet and 'dst_ip' in packet:
                length = packet.get('length', 0)
                ip_traffic[packet['src_ip']]['sent'] += length
                ip_traffic[packet['src_ip']]['total'] += length
                ip_traffic[packet['dst_ip']]['received'] += length
                ip_traffic[packet['dst_ip']]['total'] += length
        
        # Get top 10 talkers
        top_talkers = sorted(
            ip_traffic.items(),
            key=lambda x: x[1]['total'],
            reverse=True
        )[:10]
        
        # Store statistics
        self.statistics = {
            'total_packets': len(self.packets),
            'total_bytes': total_bytes,
            'protocols': dict(protocol_counts),
            'unique_ips': len(unique_ips),
            'duration': round(duration, 2),
            'start_time': datetime.fromtimestamp(min(timestamps)).isoformat() if timestamps else None,
            'end_time': datetime.fromtimestamp(max(timestamps)).isoformat() if timestamps else None,
            'top_talkers': [
                {
                    'ip': ip,
                    'sent': stats['sent'],
                    'received': stats['received'],
                    'total': stats['total']
                }
                for ip, stats in top_talkers
            ]
        }
    
    def get_statistics(self):
        """
        Get calculated statistics
        
        Returns:
            Dictionary with statistics
        """
        return self.statistics
    
    def get_packets_by_protocol(self, protocol):
        """
        Filter packets by protocol
        
        Args:
            protocol: Protocol name (TCP, UDP, ICMP, etc.)
            
        Returns:
            List of filtered packets
        """
        return [
            p for p in self.packets
            if p.get('protocol_name', '').upper() == protocol.upper()
        ]
    
    def get_packets_by_ip(self, ip_address):
        """
        Filter packets by IP address (source or destination)
        
        Args:
            ip_address: IP address to filter
            
        Returns:
            List of filtered packets
        """
        return [
            p for p in self.packets
            if p.get('src_ip') == ip_address or p.get('dst_ip') == ip_address
        ]
    
    def get_conversation(self, ip1, ip2):
        """
        Get all packets in a conversation between two IPs
        
        Args:
            ip1: First IP address
            ip2: Second IP address
            
        Returns:
            List of packets in the conversation
        """
        return [
            p for p in self.packets
            if (p.get('src_ip') == ip1 and p.get('dst_ip') == ip2) or
               (p.get('src_ip') == ip2 and p.get('dst_ip') == ip1)
        ]


# Example usage
if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python pcap_parser.py <pcap_file>")
        sys.exit(1)
    
    parser = PcapParser(sys.argv[1])
    packets = parser.parse()
    stats = parser.get_statistics()
    
    print(f"\nParsed {stats['total_packets']} packets")
    print(f"Total bytes: {stats['total_bytes']:,}")
    print(f"Duration: {stats['duration']} seconds")
    print(f"Unique IPs: {stats['unique_ips']}")
    print(f"\nProtocol distribution:")
    for protocol, count in stats['protocols'].items():
        print(f"  {protocol}: {count}")

# Made with Bob
