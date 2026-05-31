# Sample PCAP Files

This directory contains real network traffic capture files for testing and demonstration purposes.

## Files

### sample1.pcap (23 MB)
- **Date:** March 6, 2015
- **Source:** Network Forensics PCAP Collection (first 50,000 packets)
- **Original:** snort.log.1425600057
- **Packets:** ~50,000 packets
- **Description:** Network traffic capture containing various protocols and connections
- **Use Case:** General network analysis, protocol distribution visualization

### sample2.pcap (20 MB)
- **Date:** March 9, 2015
- **Source:** Network Forensics PCAP Collection (first 50,000 packets)
- **Original:** snort.log.1425859232
- **Packets:** ~50,000 packets
- **Description:** Network traffic capture with diverse communication patterns
- **Use Case:** Traffic flow analysis, connection mapping

## What These Files Contain

These PCAP files capture real network traffic and include:

- **TCP Connections** - Web browsing, file transfers, API calls
- **UDP Traffic** - DNS queries, streaming data, VoIP
- **ICMP Packets** - Ping requests, network diagnostics
- **ARP Requests** - Address resolution protocol for local network

## How to Use

1. **Upload to NetViz:**
   - Open http://localhost:5001
   - Drag and drop any .pcap file
   - Wait for processing (large files may take 30-60 seconds)

2. **Explore the Visualization:**
   - See network graph with IP addresses as nodes
   - Different colors represent different protocols
   - Zoom and pan to explore connections
   - Click nodes for detailed information

3. **Analyze Statistics:**
   - View total packet count
   - See protocol breakdown
   - Identify top communicating IPs
   - Examine traffic patterns

## Expected Results

When you upload these files, you should see:

- **Hundreds to thousands of nodes** (unique IP addresses)
- **Complex network topology** showing communication patterns
- **Protocol diversity** - mix of TCP (blue), UDP (green), ICMP (red)
- **Hub nodes** - IPs with many connections (servers, gateways)
- **Edge nodes** - IPs with few connections (clients)

## Security Note

These are historical network captures from 2015 and contain no sensitive or personal information. They are commonly used for educational and research purposes in network security training.

## File Format

- **Format:** PCAP (Packet Capture)
- **Compatible with:** Wireshark, tcpdump, Scapy, and other network analysis tools
- **Captured by:** Snort IDS (Intrusion Detection System)

## Troubleshooting

If files fail to upload:
- Check file size (max 100MB by default)
- Ensure backend is running on port 5001
- Check browser console for errors
- Try with a smaller PCAP file first

## Additional Resources

For more PCAP samples, visit:
- https://www.netresec.com/index.ashx?page=PcapFiles
- https://wiki.wireshark.org/SampleCaptures
- https://www.malware-traffic-analysis.net/