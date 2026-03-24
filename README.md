# Wooclap Tech Case — Real-time Rock Paper Scissors Lizard Spock


## 📌 Overview

This project is a real-time two-player implementation of the game:

**Rock, Paper, Scissors, Lizard, Spock**

The application allows two players to connect from separate devices and play synchronized rounds in real-time using WebSockets.

The focus of this implementation is on:

* clarity of architecture
* state management
* real-time synchronization
* separation of concerns

---

## 🏗️ Architecture

The project is structured as a **monorepo** with three main parts:

```txt
apps/
  frontend/   → React + Vite + Zustand
  backend/    → Node.js + Express + Socket.IO

packages/
  shared/     → shared domain logic and socket protocol
```

### Frontend

* Built with React (Vite)
* Uses Zustand for state management
* UI is driven by explicit game phases
* Communicates with the backend via Socket.IO

### Backend

* Node.js + Express + Socket.IO
* Acts as the **source of truth**
* Handles:

    * player connections
    * game state
    * round resolution
    * event broadcasting

### Shared package

Contains:

* game actions (`rock`, `paper`, etc.)
* rules and round resolution logic
* socket event definitions
* game phases

This ensures consistency between frontend and backend.

---

## 🔄 Game Flow

1. First player connects → waits for opponent
2. Second player connects → game starts
3. Players choose an action
4. Once both actions are selected:

    * the backend computes the result
    * each player receives their personalized outcome
5. A new round can be started

---

## 🧠 Key Design Choices

### Backend as source of truth

The backend is responsible for resolving rounds and synchronizing both clients.
This avoids inconsistencies between players.

### Explicit state machine (frontend)

The UI is driven by a single `phase`:

* `connecting`
* `waiting-for-opponent`
* `choosing`
* `waiting-for-other-player`
* `round-result`

This makes the UI predictable and easy to reason about.

### Zustand for state management

Zustand was chosen for:

* simplicity
* low boilerplate
* clear separation between state and UI

### Shared domain layer

A shared package is used to:

* avoid duplication
* define a clear contract between frontend and backend
* centralize game logic

---

## 🚀 Getting Started

### 1. Install dependencies

From the root:

```bash
npm install
```

---

### 2. Start the backend

```bash
npm run dev:backend
```

Server runs on:

```txt
http://localhost:3000
```

---

### 3. Start the frontend

```bash
npm run dev:frontend
```

Then open:

```txt
http://localhost:5173
```

---

### 4. Play the game

* Open two browser tabs (or two devices)
* Each tab represents one player
* Play rounds in real-time

---

## 📡 Socket Events

### Client → Server

* `game:select-action`
* `game:new-round`

### Server → Client

* `game:waiting-for-opponent`
* `game:ready`
* `game:player-selected`
* `game:round-result`
* `game:round-reset`
* `game:error`

---

## ⚠️ Assumptions

As per the exercise guidelines:

* maximum of 2 players
* no reconnection handling
* players do not leave the game
* no persistence required

---

## ✨ Possible Improvements

* private rooms with invitation links
* reconnection handling
* match history / best-of-N rounds
* UI improvements and animations
* accessibility improvements

---

## 🧪 Testing

Unit tests are implemented with Vitest.

Run all tests from the root:

```bash
npm run test
````

---

## 📝 Notes

The implementation focuses on **clarity and correctness over visual design**, as requested in the exercise.

---

## ✅ Summary

This project demonstrates:

* real-time synchronization using WebSockets
* clear separation of concerns
* predictable state management
* shared domain modeling between frontend and backend

---

Thank you for reviewing this project 🙌
