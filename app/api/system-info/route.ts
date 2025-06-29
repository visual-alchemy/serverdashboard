import type { NextRequest } from "next/server"
import os from "os"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

let previousNetworkStats = { rx: 0, tx: 0, timestamp: Date.now() }

async function getNetworkStats() {
  try {
    const { stdout } = await execAsync("cat /proc/net/dev | grep -E '(eth0|ens|enp|wlan)' | head -1")
    const parts = stdout.trim().split(/\s+/)
    if (parts.length >= 10) {
      const rx = Number.parseInt(parts[1]) || 0
      const tx = Number.parseInt(parts[9]) || 0
      const now = Date.now()

      const rxRate = Math.max(0, (rx - previousNetworkStats.rx) / ((now - previousNetworkStats.timestamp) / 1000))
      const txRate = Math.max(0, (tx - previousNetworkStats.tx) / ((now - previousNetworkStats.timestamp) / 1000))

      previousNetworkStats = { rx, tx, timestamp: now }

      return { rx, tx, rxRate, txRate }
    }
  } catch (error) {
    console.error("Error getting network stats:", error)
  }

  return { rx: 0, tx: 0, rxRate: 0, txRate: 0 }
}

async function getDiskUsage() {
  try {
    const { stdout } = await execAsync("df -h / | tail -1")
    const parts = stdout.trim().split(/\s+/)
    if (parts.length >= 6) {
      const total = Number.parseFloat(parts[1].replace("G", "")) * 1024 * 1024 * 1024
      const used = Number.parseFloat(parts[2].replace("G", "")) * 1024 * 1024 * 1024
      const usage = Number.parseFloat(parts[4].replace("%", ""))

      return {
        total,
        used,
        free: total - used,
        usage,
      }
    }
  } catch (error) {
    console.error("Error getting disk usage:", error)
  }

  return { total: 0, used: 0, free: 0, usage: 0 }
}

async function getCPUUsage() {
  return new Promise<number>((resolve) => {
    const startMeasure = os.cpus()

    setTimeout(() => {
      const endMeasure = os.cpus()

      let totalIdle = 0
      let totalTick = 0

      for (let i = 0; i < startMeasure.length; i++) {
        const startCpu = startMeasure[i]
        const endCpu = endMeasure[i]

        const startTotal = Object.values(startCpu.times).reduce((acc, time) => acc + time, 0)
        const endTotal = Object.values(endCpu.times).reduce((acc, time) => acc + time, 0)

        const idle = endCpu.times.idle - startCpu.times.idle
        const total = endTotal - startTotal

        totalIdle += idle
        totalTick += total
      }

      const usage = 100 - (totalIdle / totalTick) * 100
      resolve(Math.max(0, Math.min(100, usage)))
    }, 1000)
  })
}

async function getCPUTemperature() {
  try {
    const { stdout } = await execAsync("sensors | grep 'Core 0' | awk '{print $3}' | sed 's/+//g' | sed 's/°C//g'")
    const temp = Number.parseFloat(stdout.trim())
    return isNaN(temp) ? undefined : temp
  } catch (error) {
    return undefined
  }
}

async function getCPUSpeed() {
  try {
    const { stdout } = await execAsync("lscpu | grep 'CPU MHz' | awk '{print $3}'")
    const mhz = Number.parseFloat(stdout.trim())
    return isNaN(mhz) ? undefined : mhz / 1000 // Convert MHz to GHz
  } catch (error) {
    return undefined
  }
}

async function getProcessCount() {
  try {
    const { stdout } = await execAsync("ps aux | wc -l")
    return Number.parseInt(stdout.trim()) - 1 // Subtract header line
  } catch (error) {
    return 0
  }
}

async function getSystemInfo() {
  const [cpuUsage, diskUsage, networkStats, cpuTemp, processCount, cpuSpeed] = await Promise.all([
    getCPUUsage(),
    getDiskUsage(),
    getNetworkStats(),
    getCPUTemperature(),
    getProcessCount(),
    getCPUSpeed(), // Add this line
  ])

  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  const cpus = os.cpus()

  return {
    cpu: {
      usage: cpuUsage,
      cores: cpus.length,
      model: cpus[0]?.model || "Unknown",
      temperature: cpuTemp,
      speed: cpuSpeed, // Add this line
    },
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      usage: (usedMem / totalMem) * 100,
    },
    disk: diskUsage,
    network: networkStats,
    uptime: os.uptime(),
    loadAverage: os.loadavg(),
    processes: processCount,
  }
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const sendData = async () => {
        try {
          const systemInfo = await getSystemInfo()
          const data = `data: ${JSON.stringify(systemInfo)}\n\n`
          controller.enqueue(encoder.encode(data))
        } catch (error) {
          console.error("Error getting system info:", error)
        }
      }

      // Send initial data
      sendData()

      // Send updates every 5 seconds (changed from 2000ms to 5000ms)
      const interval = setInterval(sendData, 5000)

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
