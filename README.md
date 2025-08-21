# Node.js Real-Time Chat Backend

This repository contains the backend for a real-time chat application built with **Node.js**, **Express**, **Socket.IO**, **TypeScript**, and **MySQL**.

The backend supports user authentication, chat rooms, real-time messaging, and user presence tracking.

---

## Features

### 1. User Authentication
- User registration and login using **JWT-based authentication**.
- Passwords are **securely hashed** with bcrypt.

### 2. Chat Rooms
- Users can create **public or private chat rooms**.
- Join rooms using an **invitation link or room ID**.
- Maintain a list of rooms each user belongs to.

### 3. Real-Time Messaging
- Real-time communication using **Socket.IO**.
- Users in the same room can **exchange messages instantly**.
- Messages stored in MySQL with **sender, room, and timestamp**.

### 4. Socket.IO Events
- `join_room` – triggered when a user joins a room.
- `send_message` – triggered when a user sends a message.
- `receive_message` – broadcasts messages to all users in the room.
- `typing` – notifies when a user is typing.
- `user_status` – tracks online/offline presence.

### 5. User Presence Tracking
- Online/offline status for each user in a room.
- Stores **last seen timestamp** for offline users.

### 6. Rate Limiting & Security
- Basic message rate-limiter (e.g., max 5 messages per 10 seconds).
- Validation for incoming requests (e.g., no empty messages).
- Access control for **private rooms**.

### 7. Database
- **MySQL** is used to persist users, rooms, and messages.
- Suggested tables:
  - `users`
  - `rooms`
  - `room_members`
  - `messages`


---

## Technology Stack
- **Backend Framework:** Node.js with Express  
- **Real-Time Communication:** Socket.IO  
- **Language:** TypeScript  
- **Database:** MySQL (Prisma ORM recommended)

---

## Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MySQL Server
- (Optional) Docker for containerization

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/chat-app-backend.git
cd nodejs-chat-backend
