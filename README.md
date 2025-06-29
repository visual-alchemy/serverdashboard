![image](https://github.com/user-attachments/assets/1bba1511-1758-4498-9645-94b0f71cd5aa)# 🖥️ Server Dashboard

<div align="center">

![Server Monitor](https://img.shields.io/badge/Server-Monitor-blue?style=for-the-badge&logo=server&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)

**A beautiful, real-time server monitoring dashboard built with Next.js**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Configuration](#-configuration) • [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

- 📊 **Live system metrics**: CPU, Memory, Disk, Load, Network, Temperature
- 🔄 **Real-time updates** with Server-Sent Events (SSE)
- 🌐 **Quick access** to your favorite services (Immich, Jellyfin, etc.)
- 📱 **Mobile-friendly** responsive layout
- 🧊 **Modern dark UI** with glassmorphism & animations
- ⚡ **Lightweight**, efficient, and single-page app
- 🔧 **Fully customizable** app links and refresh rate

## 📸 Preview

![Dashboard Preview](![image](https://github.com/user-attachments/assets/5e23692d-27d6-450b-a32d-aac31f432bdf)

---

## 🚀 Installation

### Prerequisites

- Ubuntu Server 18.04+ (or any Linux distro)
- Node.js v18+ and npm
- Tools: `lm-sensors`, `htop` (for temperature and system metrics)

### Step 1: Install System Tools

```bash
sudo apt update
sudo apt install -y lm-sensors htop
sudo sensors-detect --auto
```

### Step 2: Setup Project

```bash
git clone <your-repo-url>
cd server-dashboard
npm install
# Use legacy mode if needed:
npm install --legacy-peer-deps
```

### Step 3: Build and Run

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm run build
npm start
```

Access the dashboard at:

```
http://localhost:3000
# Or remotely:
http://YOUR_SERVER_IP:3000
```

---

## ⚙️ Configuration

### Service Shortcuts

Edit the `quickAccessApps` array in `app/page.tsx`:

```ts
const quickAccessApps = [
  {
    name: "Your App",
    url: "http://localhost:PORT",
    iconUrl: "https://example.com/icon.svg",
    description: "Description here",
    color: "bg-blue-500 hover:bg-blue-600"
  },
  // Add more...
]
```

### Popular Icons

```ts
// Immich
iconUrl: "https://raw.githubusercontent.com/immich-app/immich/main/design/immich-logo.svg"

// Jellyfin
iconUrl: "https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/branding/SVG/icon-transparent.svg"

// Portainer
iconUrl: "https://raw.githubusercontent.com/portainer/portainer/develop/app/assets/ico/favicon.svg"
```

### Update Interval

Edit `app/api/system-info/route.ts`:

```ts
// Default (2 seconds)
setInterval(sendData, 2000)

// Optional: 1 second (more real-time, higher load)
setInterval(sendData, 1000)
```

---

## 🛠️ Running as a Service (Systemd)

Create a service file:

```bash
sudo nano /etc/systemd/system/server-dashboard.service
```

Content:

```ini
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
```

Then run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable server-dashboard
sudo systemctl start server-dashboard
```

---

## 🔧 Troubleshooting

### Peer Dependency Errors

```bash
npm install --legacy-peer-deps
```

### Temperature Not Showing

```bash
sudo apt install lm-sensors
sudo sensors-detect --auto
sensors
```

### Network Interface Missing

Check detection logic in `app/api/system-info/route.ts`.

### Permissions

```bash
sudo usermod -a -G adm $USER
# Re-login for changes to apply
```

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|----------|---------|-------------|
| RAM      | 512MB   | 1GB+        |
| CPU      | Modern  | Multi-core  |
| Storage  | 100MB   | 500MB+      |
| OS       | Ubuntu 18.04+ | Ubuntu 22.04+ |

---

## 🔒 Security Notes

- Dashboard runs on port `3000` by default
- Use nginx/Apache as a reverse proxy for HTTPS
- Add basic authentication for production
- Firewall port if dashboard is internal-only

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am "Add feature"`
4. Push and create PR

---

## 🆘 Support

1. Review the [Troubleshooting](#-troubleshooting) section
2. Check terminal logs (`npm start`)
3. Ensure sensors and tools are installed correctly
4. Test with `sensors` and `htop`

---

<div align="center">

**Enjoy monitoring your server! 🎉**

![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat&logo=ubuntu&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

</div>
