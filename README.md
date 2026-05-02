# Wallpaper Generator (Dual-Mode & Sun)

A specialized web application for generating high-resolution, pixelated wallpapers for Samsung Galaxy devices. Designed with a focus on creative control and mobile-first performance.

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technologies](#technologies)
4. [Supported Devices](#supported-devices)
5. [Installation](#installation)
6. [Running the App](#running-the-app)
7. [Themes & Initialization](#themes--initialization)
8. [Security](#security)

## Overview
The Wallpaper Generator allows users to compose artistic landscapes using a dual-area system (Sky and Land) and a celestial "Sun" element. The application emphasizes a pixelated aesthetic, offering both "Random" (stipple-like) and "Gradient" generation modes.

## Key Features
- **Dual-Area Composition**: Split the wallpaper horizontally or vertically with adjustable split positions.
- **Dynamic Sun Layer**: Add a sun element with customizable X/Y position and radius. It automatically clips at the horizon line in horizontal mode.
- **Pixelated Edges**: The Sun and Area generation respect density parameters, allowing for sharp, blocky edges or smooth transitions.
- **Tabbed Interface**: Clean management of Global Setup, Side A, Side B, and Sun parameters.
- **Precise Slider Controls**: Each slider includes step buttons (+/-) for single-unit adjustments.
- **Responsive Design**: Optimized for mobile and tablet views with `dvh` (Dynamic Viewport Height) support and layout adaptation.
- **High-Resolution Export**: Download full-spec PNG images directly to your device.

## Technologies
- **Frontend**: React 18 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Mobile-First, dvh fallbacks)
- **Color Picker**: `react-colorful`
- **Rendering**: HTML5 Canvas

## Supported Devices
The application includes presets for:
- **Samsung Galaxy S23**: 1080 x 2340 px (Portrait Native)
- **Samsung Galaxy Tab S10 FE+**: 2880 x 1800 px (Landscape Native)
- Supports toggling between **Portrait** and **Landscape** on all devices.

## Installation
Ensure you have [Node.js](https://nodejs.org/) installed. In Termux, you can install it via:
```bash
pkg install nodejs
```

Install dependencies:
```bash
npm install
```

## Running the App
### Development
```bash
npm run dev
```
Open the provided local link (usually `http://localhost:5173`) in your device's browser.

### Production Build
```bash
npm run build
npm run preview
```

## Themes & Initialization
Every time the application loads, it initializes with a random creative theme and a unique composition:
- **Themes**: Mountain Dusk, Ocean Sunset, Desert Dawn, Forest Morning.
- **Randomization**: The horizon line, sun position, and sun size are randomized on startup to provide instant inspiration.
- **Default Mode**: Starts in **Random (Pixelated)** mode for all areas.

## Security
A repository audit was performed using `repo-audit-readme`. 
- **Secrets Scan**: Passed (No API keys or sensitive data found).
- **Environment**: No sensitive environment variables required.
- **Build Status**: Verified successfully with `tsc` and `vite build`.
