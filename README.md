# 🌐 NetViz - PCAP Network Traffic Visualization Tool

<div align="center">

![NetViz Banner](https://via.placeholder.com/1200x300/1e3a8a/ffffff?text=NetViz+-+Network+Traffic+Visualization)

**A powerful web-based tool for visualizing and analyzing network traffic from PCAP files**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![D3.js](https://img.shields.io/badge/D3.js-7.0+-orange.svg)](https://d3js.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo](#) • [Documentation](docs/) • [Challenges](#-hackathon-challenges) • [IBM Workshop](docs/IBM_WORKSHOP.md)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Hackathon Challenges](#-hackathon-challenges)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About

**NetViz** is a comprehensive network traffic visualization tool designed for the IBM AI Workshop hackathon. It transforms complex PCAP (Packet Capture) files into intuitive, interactive network graphs, making it easy to:

- **Identify communication patterns** between network nodes
- **Detect anomalies** and unusual traffic
- **Analyze network topology** and central hubs
- **Debug network issues** visually
- **Learn network protocols** through visualization

### Why NetViz?

Traditional network analysis tools like Wireshark are powerful but can be overwhelming. NetViz provides:
- 🎨 **Visual-first approach** - See your network at a glance
- 🚀 **Web-based** - No installation required, works in any browser
- 🤖 **AI-Ready** - Built with extensibility for AI-powered analysis
- 📊 **Interactive** - Zoom, filter, and explore your network data
- 🔒 **Security-focused** - Designed for cybersecurity professionals

---

## ✨ Features

### ✅ Implemented (Base Application)

#### Backend (Python/Flask)
- **PCAP File Parsing** using Scapy/Pyshark
- **Network Graph Generation** with NetworkX
- **RESTful API** for data access
- **File Upload Handling** with validation
- **Data Processing Pipeline** for efficient analysis

#### Frontend (HTML/CSS/JS)
- **Interactive Network Graph** using D3.js Force Layout
- **File Upload Interface** with drag-and-drop
- **Real-time Visualization** updates
- **Node Information Panel** with detailed packet data
- **Responsive Design** for all devices
- **Dark/Light Theme** toggle

#### Visualization Features
- **Node Representation** - IP addresses as graph nodes
- **Edge Representation** - Communication links with traffic volume
- **Color Coding** - Different protocols (TCP/UDP/ICMP)
- **Size Scaling** - Node size based on traffic volume
- **Interactive Controls** - Zoom, pan, drag nodes
- **Filtering** - By protocol, IP range, traffic volume

### 🔨 Missing Features (Hackathon Challenges)

Participants can extend the application with:
- Advanced filtering and search
- Time-based traffic analysis
- Anomaly detection algorithms
- Protocol-specific visualizations
- Export capabilities
- Real-time packet capture
- Machine learning integration
- And more! (See [Challenges](#-hackathon-challenges))

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     NetViz System                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Frontend   │ ◄─────► │   Backend    │             │
│  │  (Browser)   │  HTTP   │   (Flask)    │             │
│  └──────────────┘         └──────────────┘             │
│         │                         │                      │
│         │                         │                      │
│    ┌────▼────┐              ┌────▼────┐                │
│    │  D3.js  │              │  Scapy  │                │
│    │ Graphs  │              │ Pyshark │                │
│    └─────────┘              └─────────┘                │
│                                   │                      │
│                              ┌────▼────┐                │
│                              │NetworkX │                │
│                              └─────────┘                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- Python 3.8+
- Flask (Web Framework)
- Scapy (Packet Parsing)
- Pyshark (Alternative Parser)
- NetworkX (Graph Analysis)
- Pandas (Data Processing)

**Frontend:**
- HTML5/CSS3
- JavaScript (ES6+)
- D3.js (Visualization)
- Bootstrap 5 (UI Framework)

**Development:**
- Git (Version Control)
- Virtual Environment (Python)
- npm (Package Management)

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/netviz.git
cd netviz
```

#### 2. Set Up Python Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

#### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Install System Dependencies (for Pyshark)

**macOS:**
```bash
brew install wireshark
```

**Ubuntu/Debian:**
```bash
sudo apt-get install tshark
```

**Windows:**
Download and install Wireshark from [wireshark.org](https://www.wireshark.org/)

#### 5. Run the Application

```bash
# Start the Flask backend
python backend/app.py
```

The application will be available at: `http://localhost:5000`

---

## 📊 Usage

### Basic Workflow

1. **Upload PCAP File**
   - Click "Upload PCAP" or drag-and-drop a .pcap file
   - Supported formats: .pcap, .pcapng

2. **View Network Graph**
   - Nodes represent IP addresses
   - Edges represent communication
   - Edge thickness = traffic volume
   - Colors indicate protocols

3. **Interact with Graph**
   - **Zoom**: Mouse wheel or pinch
   - **Pan**: Click and drag background
   - **Move Nodes**: Drag individual nodes
   - **View Details**: Click on nodes/edges

4. **Filter and Analyze**
   - Use filters to focus on specific traffic
   - Toggle protocols on/off
   - Adjust visualization parameters

### Sample PCAP Files

Sample PCAP files are provided in `sample_pcaps/` directory:
- `http_traffic.pcap` - HTTP web traffic
- `dns_queries.pcap` - DNS resolution traffic
- `mixed_protocols.pcap` - Various protocols

---

## 🏆 Hackathon Challenges

Choose challenges based on your skill level and interests!

### 🟢 Beginner Challenges (2-4 hours)

#### Challenge 1: Enhanced Filtering
**Difficulty:** ⭐⭐☆☆☆ | **Points:** 100

Add advanced filtering capabilities:
- Filter by IP address range
- Filter by port number
- Filter by time range
- Multiple simultaneous filters

**Skills:** JavaScript, UI/UX, Data filtering

---

#### Challenge 2: Protocol Statistics Dashboard
**Difficulty:** ⭐⭐☆☆☆ | **Points:** 100

Create a statistics panel showing:
- Protocol distribution (pie chart)
- Top talkers (bar chart)
- Traffic over time (line chart)
- Packet size distribution

**Skills:** D3.js, Data visualization, Statistics

---

### 🟡 Intermediate Challenges (4-6 hours)

#### Challenge 3: Time-Based Animation
**Difficulty:** ⭐⭐⭐☆☆ | **Points:** 150

Implement traffic replay:
- Timeline slider
- Play/pause controls
- Speed adjustment
- Animate packet flow

**Skills:** JavaScript animations, Time-series data, UI controls

---

#### Challenge 4: Anomaly Detection
**Difficulty:** ⭐⭐⭐☆☆ | **Points:** 150

Detect unusual patterns:
- Port scanning detection
- DDoS pattern recognition
- Unusual traffic volume alerts
- Highlight anomalies in graph

**Skills:** Algorithm design, Pattern recognition, Security

---

#### Challenge 5: Export Capabilities
**Difficulty:** ⭐⭐⭐☆☆ | **Points:** 120

Add export features:
- Export graph as PNG/SVG
- Export data as CSV/JSON
- Generate PDF report
- Share analysis via link

**Skills:** File generation, Data serialization, Reporting

---

### 🔴 Advanced Challenges (6-8 hours)

#### Challenge 6: Real-Time Packet Capture
**Difficulty:** ⭐⭐⭐⭐☆ | **Points:** 200

Implement live capture:
- Capture from network interface
- Real-time graph updates
- WebSocket communication
- Start/stop controls

**Skills:** System programming, WebSockets, Real-time data

---

#### Challenge 7: Machine Learning Integration
**Difficulty:** ⭐⭐⭐⭐☆ | **Points:** 200

Add ML-powered features:
- Traffic classification
- Threat prediction
- Behavioral analysis
- Clustering similar patterns

**Skills:** Machine Learning, Python, scikit-learn

---

#### Challenge 8: Deep Packet Inspection (DPI)
**Difficulty:** ⭐⭐⭐⭐⭐ | **Points:** 250

Implement protocol analysis:
- HTTP request/response parsing
- DNS query analysis
- TLS handshake visualization
- Application-layer insights

**Skills:** Protocol knowledge, Parsing, Security

---

### 🎁 Bonus Challenges

- **Multi-PCAP Comparison** - Compare multiple captures
- **3D Network Visualization** - Use Three.js for 3D graphs
- **Geolocation Mapping** - Show IP locations on world map
- **Custom Protocol Support** - Add parsers for specific protocols
- **Performance Optimization** - Handle large PCAP files (>1GB)

---

## 📡 API Documentation

### Endpoints

#### Upload PCAP File
```http
POST /api/upload
Content-Type: multipart/form-data

Parameters:
  file: PCAP file (required)

Response:
{
  "success": true,
  "file_id": "abc123",
  "filename": "capture.pcap",
  "size": 1024000,
  "packets": 5000
}
```

#### Get Network Graph
```http
GET /api/graph/{file_id}

Response:
{
  "nodes": [
    {
      "id": "192.168.1.1",
      "label": "192.168.1.1",
      "packets": 150,
      "bytes": 45000
    }
  ],
  "edges": [
    {
      "source": "192.168.1.1",
      "target": "192.168.1.2",
      "packets": 50,
      "bytes": 15000,
      "protocol": "TCP"
    }
  ]
}
```

#### Get Statistics
```http
GET /api/stats/{file_id}

Response:
{
  "total_packets": 5000,
  "total_bytes": 1500000,
  "protocols": {
    "TCP": 3000,
    "UDP": 1500,
    "ICMP": 500
  },
  "duration": 120.5,
  "start_time": "2024-01-01T10:00:00",
  "end_time": "2024-01-01T10:02:00"
}
```

---

## 🤝 Contributing

We welcome contributions from all skill levels!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript
- Write clear commit messages
- Add tests for new features
- Update documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📚 Resources

### Learning Materials
- [Scapy Documentation](https://scapy.readthedocs.io/)
- [D3.js Tutorials](https://d3js.org/tutorials)
- [NetworkX Guide](https://networkx.org/documentation/)
- [PCAP File Format](https://wiki.wireshark.org/Development/LibpcapFileFormat)

### Tools
- [Wireshark](https://www.wireshark.org/) - Network protocol analyzer
- [tcpdump](https://www.tcpdump.org/) - Command-line packet analyzer
- [NetworkX](https://networkx.org/) - Network analysis library

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Permission denied" when capturing packets**
```bash
# Solution: Run with sudo or add user to wireshark group
sudo usermod -a -G wireshark $USER
```

**Issue: "Module not found: scapy"**
```bash
# Solution: Install in virtual environment
pip install scapy
```

**Issue: Graph not rendering**
- Check browser console for errors
- Ensure D3.js is loaded
- Verify API is returning data

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- IBM for the workshop opportunity
- Wireshark team for packet capture tools
- D3.js community for visualization library
- NetworkX developers for graph analysis tools

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/YOUR-USERNAME/netviz/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR-USERNAME/netviz/discussions)
- **Email:** support@netviz.dev

---

<div align="center">

**Built with ❤️ for the IBM AI Workshop Hackathon**

[⬆ Back to Top](#-netviz---pcap-network-traffic-visualization-tool)

</div>