"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, HardDrive, MemoryStick, Network, Server, Thermometer, ExternalLink } from "lucide-react"

interface SystemInfo {
  cpu: {
    usage: number
    cores: number
    model: string
    temperature?: number
    speed?: number // CPU frequency in GHz
  }
  memory: {
    total: number
    used: number
    free: number
    usage: number
  }
  disk: {
    total: number
    used: number
    free: number
    usage: number
  }
  network: {
    rx: number
    tx: number
    rxRate: number
    txRate: number
  }
  uptime: number
  loadAverage: number[]
  processes: number
}

const quickAccessApps = [
  {
    name: "Immich",
    url: "http://localhost:2283",
    iconUrl:
      "https://raw.githubusercontent.com/immich-app/immich/3d35e65f270724c7f3923a2052294670eecff9a8/design/immich-logo.svg",
    description: "Self-hosted photo and video backup solution",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    name: "Jellyfin",
    url: "http://localhost:8096",
    iconUrl: "https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/branding/SVG/icon-transparent.svg",
    description: "Free software media system",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    name: "Portainer",
    url: "http://localhost:9000",
    iconUrl: "https://raw.githubusercontent.com/portainer/portainer/develop/app/assets/ico/favicon.svg",
    description: "Container management platform",
    color: "bg-teal-500 hover:bg-teal-600",
  },
  {
    name: "Grafana",
    url: "http://localhost:3000",
    iconUrl: "https://raw.githubusercontent.com/grafana/grafana/main/public/img/grafana_icon.svg",
    description: "Analytics and monitoring platform",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    name: "Nextcloud",
    url: "http://localhost:8080",
    iconUrl: "https://raw.githubusercontent.com/nextcloud/server/master/core/img/logo/logo.svg",
    description: "Self-hosted productivity platform",
    color: "bg-green-500 hover:bg-green-600",
  },
]

export default function Dashboard() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource("/api/system-info")

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setSystemInfo(data)
      } catch (error) {
        console.error("Error parsing system info:", error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  if (!systemInfo) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Server className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg text-slate-300">Loading system information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Server className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Server Dashboard</h1>
              <p className="text-slate-400 text-lg">Real-time system monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
            <span className="text-sm font-medium text-white">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        {/* System Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CPU Usage */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                CPU Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-3">{systemInfo.cpu.usage.toFixed(1)}%</div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemInfo.cpu.usage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {systemInfo.cpu.model.includes("Virtual") ? "Virtual" : systemInfo.cpu.model.split(" ")[0]}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {systemInfo.cpu.cores} cores @ {systemInfo.cpu.speed ? `${systemInfo.cpu.speed.toFixed(1)}GHz` : "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Memory Usage */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-green-400" />
                Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-3">{systemInfo.memory.usage.toFixed(1)}%</div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemInfo.memory.usage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {formatBytes(systemInfo.memory.used)} / {formatBytes(systemInfo.memory.total)}
              </p>
              <p className="text-xs text-slate-400 font-medium">{formatBytes(systemInfo.memory.free)} free</p>
            </CardContent>
          </Card>

          {/* Disk Usage */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-orange-400" />
                Disk Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-3">{systemInfo.disk.usage.toFixed(1)}%</div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemInfo.disk.usage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {formatBytes(systemInfo.disk.used)} / {formatBytes(systemInfo.disk.total)}
              </p>
              <p className="text-xs text-slate-400 font-medium">{formatBytes(systemInfo.disk.free)} free</p>
            </CardContent>
          </Card>

          {/* System Load */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-400" />
                System Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-3">
                {((systemInfo.loadAverage[0] / systemInfo.cpu.cores) * 100).toFixed(1)}%
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((systemInfo.loadAverage[0] / systemInfo.cpu.cores) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium">Avg Load: {systemInfo.loadAverage[0].toFixed(2)}</p>
              <p className="text-xs text-slate-400 font-medium">Cores: {systemInfo.cpu.cores}</p>
            </CardContent>
          </Card>
        </div>

        {/* Network and Temperature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Network Activity */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Network className="h-5 w-5 text-cyan-400" />
                Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Download</span>
                  <div className="text-right">
                    <div className="font-bold text-white text-lg">{formatBytes(systemInfo.network.rxRate)}/s</div>
                    <div className="text-xs text-slate-400 font-medium">
                      Total: {formatBytes(systemInfo.network.rx)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Upload</span>
                  <div className="text-right">
                    <div className="font-bold text-white text-lg">{formatBytes(systemInfo.network.txRate)}/s</div>
                    <div className="text-xs text-slate-400 font-medium">
                      Total: {formatBytes(systemInfo.network.tx)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemInfo.cpu.temperature ? (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-300">CPU Temperature</span>
                    <Badge
                      className={`font-semibold ${
                        systemInfo.cpu.temperature > 70
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-green-500/20 text-green-400 border-green-500/30"
                      }`}
                    >
                      {systemInfo.cpu.temperature}°C
                    </Badge>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-300">CPU Temperature</span>
                    <Badge className="bg-slate-700/50 text-slate-400 border-slate-600 font-semibold">N/A</Badge>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Uptime</span>
                  <span className="text-sm text-white font-semibold">{formatUptime(systemInfo.uptime)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Last Updated</span>
                  <span className="text-sm text-slate-400 font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Processes</span>
                  <span className="text-sm text-white font-semibold">{systemInfo.processes}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              <ExternalLink className="h-6 w-6 text-slate-400" />
              Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickAccessApps.map((app) => (
                <Button
                  key={app.name}
                  className={`h-16 flex items-center justify-start gap-3 px-4 transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 ${app.color}`}
                  onClick={() => window.open(app.url, "_blank")}
                  title={app.description}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={app.iconUrl || "/placeholder.svg"}
                      alt={`${app.name} icon`}
                      className="h-6 w-6 filter brightness-0 invert"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const fallbackIcon = target.nextElementSibling as HTMLElement
                        if (fallbackIcon) fallbackIcon.style.display = "block"
                      }}
                    />
                    <ExternalLink className="h-6 w-6 text-white hidden" />
                  </div>
                  <span className="text-sm font-semibold text-white">{app.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
