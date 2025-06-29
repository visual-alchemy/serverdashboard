<div align="center">

![Server Monitor](https://img.shields.io/badge/Server-Monitor-blue?style=for-the-badge&logo=server&logoColor=white)

![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js&logoColor=white)

![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript&logoColor=white)

![React](https://img.shields.io/badge/React-18.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)

</div>

# 🖥️ Server Dashboard

A beautiful, real-time server monitoring dashboard built with Next.js that displays system information and provides quick access to your self-hosted applications.

![Server Dashboard](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9s0CB2vO6wimARpX6cxWa0QAWA1gsj.png)

## ✨ Features

### 📊 Real-time System Monitoring
- **CPU Usage** - Live percentage, core count, frequency, and model information
- **Memory Usage** - RAM utilization with detailed breakdown and free space
- **Disk Usage** - Storage space monitoring with free space display
- **System Load** - Load average percentage and core utilization
- **Network Activity** - Real-time upload/download speeds and totals
- **System Uptime** - Server uptime and process count
- **CPU Temperature** - Hardware temperature monitoring (if available)

### 🔄 Live Updates
- Server-Sent Events (SSE) for real-time data streaming
- Updates every 2 seconds automatically (configurable)
- Connection status indicator
- No manual refresh required

### 🚀 Quick Access Panel
- One-click access to your self-hosted applications
- Custom icons loaded from URLs
- Configurable service links with vibrant colored backgrounds
- Hover descriptions for each service

### 📱 Responsive Design
- Single-page layout (no scrolling required)
- Mobile-friendly responsive grid
- Modern dark theme with glass-morphism effects
- Smooth animations and transitions

## 🛠️ Installation

### Prerequisites
- Ubuntu Server (18.04 or later)
- Node.js 18+ and npm
- Basic system monitoring tools

### Step 1: Install System Dependencies

\`\`\`bash
# Update package list
sudo apt update

# Install system monitoring tools
sudo apt install -y lm-sensors htop

# Initialize hardware sensors (optional, for temperature monitoring)
sudo sensors-detect --auto
\`\`\`

### Step 2: Clone and Setup Project

\`\`\`bash
# Clone the project (or download the files)
# Navigate to your project directory
cd server-dashboard

# Install Node.js dependencies
npm install

# If you encounter peer dependency issues, use:
npm install --legacy-peer-deps
\`\`\`

### Step 3: Build and Start

#### Development Mode
\`\`\`bash
npm run dev
\`\`\`

#### Production Mode
\`\`\`bash
# Build the application
npm run build

# Start the production server
npm start
\`\`\`

### Step 4: Access Dashboard

Open your browser and navigate to:
\`\`\`
http://localhost:3000
\`\`\`

Or access remotely using your server's IP:
\`\`\`
http://YOUR_SERVER_IP:3000
\`\`\`

## ⚙️ Configuration

### Customizing Quick Access Apps

Edit the \`quickAccessApps\` array in \`app/page.tsx\`:

\`\`\`typescript
const quickAccessApps = [
  { 
    name: "Your App Name", 
    url: "http://localhost:PORT", 
    iconUrl: "https://example.com/icon.svg",
    description: "Description of your app",
    color: "bg-blue-500 hover:bg-blue-600" // Choose your color theme
  },
  // Add more apps here...
]
\`\`\`

### Popular Self-hosted App Icons

Here are some popular icon URLs you can use:

\`\`\`typescript
// Immich (Photo Management)
iconUrl: "https://raw.githubusercontent.com/immich-app/immich/main/design/immich-logo.svg"

// Jellyfin (Media Server)
iconUrl: "https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/branding/SVG/icon-transparent.svg"

// Portainer (Docker Management)
iconUrl: "https://raw.githubusercontent.com/portainer/portainer/develop/app/assets/ico/favicon.svg"

// Grafana (Analytics)
iconUrl: "https://raw.githubusercontent.com/grafana/grafana/main/public/img/grafana_icon.svg"

// Nextcloud (Cloud Storage)
iconUrl: "https://raw.githubusercontent.com/nextcloud/server/master/core/img/logo/logo.svg"

// Home Assistant
iconUrl: "https://raw.githubusercontent.com/home-assistant/assets/master/logo/logo.svg"

// Plex
iconUrl: "https://raw.githubusercontent.com/plexinc/pms-docker/master/root/usr/lib/plexmediaserver/Resources/plex-icon.svg"
\`\`\`

### Adjusting Refresh Rate

To change the refresh rate, modify the interval in \`app/api/system-info/route.ts\`:

\`\`\`typescript
// Current: Updates every 2 seconds (2000ms)
const interval = setInterval(sendData, 2000)

// For 1-second updates (more real-time but higher server load):
const interval = setInterval(sendData, 1000)

// For 5-second updates (lower server load):
const interval = setInterval(sendData, 5000)
\`\`\`

**Note about 1-second refresh rate:** While possible, updating every second will increase server load due to:
- More frequent system calls to gather metrics
- Higher CPU usage from constant monitoring
- Increased memory usage from more frequent data processing
- More network traffic for SSE updates

For most use cases, 2-second updates provide a good balance between real-time monitoring and system performance.

## 🔧 Troubleshooting

### Common Installation Issues

#### Peer Dependency Conflicts
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

#### Permission Issues with System Commands
The dashboard uses system commands to gather metrics. If you encounter permission issues:

\`\`\`bash
# Add your user to necessary groups
sudo usermod -a -G adm $USER

# Logout and login again for changes to take effect
\`\`\`

#### Temperature Monitoring Not Working
\`\`\`bash
# Install and configure lm-sensors
sudo apt install lm-sensors
sudo sensors-detect --auto

# Test if sensors work
sensors
\`\`\`

#### Network Interface Detection Issues
The dashboard auto-detects network interfaces. If your interface isn't detected, you may need to modify the network detection logic in \`app/api/system-info/route.ts\`.

### Performance Considerations

- The dashboard updates every 2 seconds by default
- CPU usage calculation takes 1 second to measure accurately
- Network statistics are calculated based on interface counters
- Reducing refresh rate to 1 second will increase server load
- For production use, consider monitoring the dashboard's own resource usage

## 🚀 Running as a Service

To run the dashboard as a system service:

### Create Service File
\`\`\`bash
sudo nano /etc/systemd/system/server-dashboard.service
\`\`\`

### Service Configuration
\`\`\`ini
[Unit]
Description=Server Dashboard
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/server-dashboard
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
\`\`\`

### Enable and Start Service
\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable server-dashboard
sudo systemctl start server-dashboard
sudo systemctl status server-dashboard
\`\`\`

## 🔒 Security Considerations

- The dashboard exposes system information - consider restricting access
- Use a reverse proxy (nginx/Apache) for HTTPS
- Consider implementing authentication for production use
- Firewall the port (3000) if not needed externally

## 📊 System Requirements

- **Minimum RAM:** 512MB
- **Recommended RAM:** 1GB+
- **CPU:** Any modern CPU (ARM64 and x86_64 supported)
- **Storage:** 100MB for application files
- **Network:** Minimal bandwidth required for SSE updates

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the dashboard.

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all system dependencies are installed
3. Check the console for error messages
4. Ensure your Ubuntu version is supported (18.04+)

---

**Enjoy monitoring your server! 🎉**
