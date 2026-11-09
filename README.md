# Cozy Homelab Command Center

Build a premium, modern Homelab Control Center

web application.

PURPOSE:

A centralized management dashboard for a

self-hosted homelab infrastructure.

DESIGN:

- Premium dark theme

- Modern server management aesthetic

- Responsive desktop, tablet and mobile UI

- Sidebar navigation

- Interactive cards and charts

- Blue and cyan accent colors

- Clean typography

MODULES:

1. Overview

- Overall infrastructure health

- CPU, RAM and storage usage

- Network traffic

- Service uptime

- Active virtual machines and containers

2. Proxmox

- Virtual machine management

- LXC container management

- CPU and memory monitoring

- Storage monitoring

- Start, stop and restart actions

3. Home Assistant

- Lights and switches

- Sensors and temperatures

- Automations

- Climate controls

- Device status

4. Media Center

- Plex server status

- Jellyfin server status

- Active streams

- Jellyseerr requests

- Media storage usage

5. Docker

- Container list

- Container status

- Logs

- Start, stop and restart

6. Network

- Network devices

- IP addresses

- Connectivity monitoring

- Twingate status

- Internet uptime

7. Settings

- API integrations

- Authentication

- User management

- Notifications

TECHNICAL REQUIREMENTS:

- React and TypeScript

- Modular component architecture

- Secure backend API

- No API secrets in frontend code

- Use mock data initially

- Prepare integration adapters for

  Proxmox, Home Assistant, Plex,

  Jellyfin and Docker.

- Do not execute real commands yet.

- All management actions must require

  confirmation.

- Include loading, error and empty states.

IMPORTANT:

First build the complete UI and navigation.

Use realistic mock data.

Do not implement backend integrations yet.

Make the application production-ready

in structure and design.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/081c951c-a7f5-596b-abf9-c51406484090).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
