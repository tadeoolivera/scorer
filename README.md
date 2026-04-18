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

Current game modes:
- Conga
- Poker (WIP)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Routes](#routes)
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

## Routes

- `/` -> Home page
- `/conga` -> Conga scorer page
- `/poker` -> Poker scorer page

---

## Roadmap

- Add more game modes.
- Persist active match state in local storage.
- Add undo for last round.
- Export/share match results.
- Add multi-language UI support.

---

## License

This project is licensed under the MIT License.