# Tech Case — Real-time Rock Paper Scissors Lizard Spock

## 📌 Overview

This project is a real-time two-player implementation of the game:

**Rock, Paper, Scissors, Lizard, Spock**

The application allows two players to connect from separate devices and play synchronized rounds in real-time using WebSockets.

Players can either join a shared game or create a **private room** and invite another player via a link.

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
* Handles room creation and joining via URL
* Communicates with the backend via Socket.IO

### Backend

* Node.js + Express + Socket.IO
* Acts as the **source of truth**
* Manages multiple game sessions (rooms)
* Handles:

    * player connections
    * room lifecycle
    * game state per room
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

### Private Room Flow

1. A player creates a private room
2. A unique room ID is generated
3. The player shares the invitation link (`/?room=XXXXXX`)
4. A second player joins using this link
5. The game starts once both players are connected

### Game Round Flow

1. Both players choose an action

2. Once both actions are selected:

    * the backend computes the result
    * each player receives their personalized outcome

3. A new round can be started

---

## 🔐 Private Rooms

The application supports isolated game sessions using private rooms.

### How it works

* Each room has a unique identifier
* Players join a room using:

    * a generated link
    * or a direct room ID

### Technical implementation

* Rooms are stored in-memory using a `Map`
* Each room contains:

    * connected players
    * current selections
* Each socket joins a Socket.IO room (`socket.join(roomId)`)
* Events are scoped per room using:

```js
io.to(roomId).emit(...)
```

### Benefits

* full isolation between games
* scalable design (can extend to matchmaking or lobbies)
* clean separation of sessions

---

## 🧠 Key Design Choices

### Backend as source of truth

The backend is responsible for:

* resolving rounds
* synchronizing players
* managing rooms

This avoids inconsistencies between clients.

---

### Room-based architecture

Instead of a single global game state, the backend manages **multiple rooms**, each representing an isolated game session.

This makes the system:

* extensible
* easier to scale
* closer to real-world multiplayer systems

---

### Explicit state machine (frontend)

The UI is driven by a single `phase`:

* `connecting`
* `waiting-for-opponent`
* `choosing`
* `waiting-for-other-player`
* `round-result`

This makes the UI predictable and easy to reason about.

---

### Zustand for state management

Zustand was chosen for:

* simplicity
* low boilerplate
* clear separation between state and UI

---

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

#### Option 1 — Quick test

* Open two browser tabs
* Create a room in one tab
* Join from the second tab

#### Option 2 — Invitation link

* Create a private room
* Copy the invitation link
* Open it in another browser/device

---

## 📡 Socket Events

### Client → Server

* `game:create-private-room`
* `game:join-private-room`
* `game:select-action`
* `game:new-round`

### Server → Client

* `game:room-created`
* `game:room-joined`
* `game:waiting-for-opponent`
* `game:ready`
* `game:player-selected`
* `game:round-result`
* `game:round-reset`
* `game:error`

---

## ⚠️ Assumptions

As per the exercise guidelines:

* maximum of 2 players per room
* no reconnection handling
* players do not leave the game
* no persistence required
* rooms are stored in memory

---

## ✨ Possible Improvements

* reconnection handling
* room expiration / cleanup strategy
* matchmaking system
* match history / best-of-N rounds
* UI improvements and animations
* accessibility improvements
* persistence layer (e.g. Redis)

---

## 🧪 Testing

Unit tests are implemented with Vitest.

Run all tests from the root:

```bash
npm run test
```

Coverage focuses on:

* shared game logic (`resolveRound`)
* backend room state management

---

## 📝 Notes

The implementation focuses on **clarity, robustness, and scalability of the architecture**, rather than visual design.

---

## ✅ Summary

This project demonstrates:

* real-time synchronization using WebSockets
* room-based multiplayer architecture
* clear separation of concerns
* predictable state management
* shared domain modeling between frontend and backend

---

Thank you for reviewing this project 🙌
