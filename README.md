<h1 align="center">Scorer</h1>

<p align="center">
	A clean, fast score tracker for tabletop and casual games.
</p>

<p align="center">
	<img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
	<img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
	<img alt="Router" src="https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
	<img alt="ESLint" src="https://img.shields.io/badge/ESLint-9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
</p>

---

## Overview

Scorer helps you run matches without paper notes or spreadsheet friction.

Current game mode:
- Conga

What it handles today:
- Player registration
- Round point entry
- Auto-elimination by score limit
- Rejoin flow for eliminated players
- Responsive UI for desktop and mobile

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Conga Rules in App](#conga-rules-in-app)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

| Area | Included |
|---|---|
| Match setup | Set a max score before starting |
| Players | Add and remove players during match |
| Rounds | Register points per player each round |
| Elimination | Auto-remove players at/above score limit |
| Rejoin | Bring eliminated players back with current highest active score |
| UI | Mobile-friendly scoreboard and modals |

---

## Tech Stack

- React 19
- Vite 8
- React Router 7
- React Icons
- ESLint 9

---

## Quick Start

### Requirements

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## Routes

- `/` -> Home page
- `/conga` -> Conga scorer page

---

## Project Structure

```text
src/
	components/
		Scores.jsx        # Reusable score table component
	pages/
		Home.jsx          # Game selector page
		Conga.jsx         # Conga game logic and UI
	router/
		AppRouter.jsx     # Route definitions
	App.css             # Component/page styles
	index.css           # Global styles and theme variables
	main.jsx            # Application entry point
```

---

## Conga Rules in App

1. Set the max score before match start.
2. Add players.
3. Register each round's points.
4. Players at or above max score move to eliminated list.
5. Eliminated players can rejoin with the highest active score.

---

## Roadmap

- Add more game modes (for example Poker).
- Persist active match state in local storage.
- Add undo for last round.
- Export/share match results.
- Add multi-language UI support.

---

## License

No license has been defined yet.
