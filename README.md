# 🥕 FreshConnect

This website was made for CPTS-489 at WSU Pullman.

FreshConnect is an online marketplace that connects small-scale farmers, local artisans, and eco-conscious consumers. Drawing inspiration from popular farmer’s market concepts, the platform offers fresh produce, homemade goods, and other region-specific items. By focusing on local products, our project aligns with the current demand for transparency, quality, and sustainable sourcing.

---

## 📦 Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, Mongoose, JWT
- **Database**: MongoDB (NoSQL)

---

## 🚀 Getting Started

These instructions will get the project up and running on your local machine.

### 1. Clone the Repository

### 2. Install Dependencies
- In the root directory, cd frontend and run npm install
- In a new terminal, from the root directory, cd backend and run npm install

### 3. Create .env file in /backend
- If not already in /backend, add a .env file with the following variables:
    - PORT=4000
    - MONGO_URI=your_mongodb_connection_string
    - JWT_SECRET=your_secret

### 4. Run the App
- **Start the backend**:
    - In the root, cd backend and run npm start
- **Start the frontend**:
    - In a new terminal in the root, cd frontend and run npm start

---

## 🛢️ MongoDB Dump & Restore

### 💾 Create a Backup (mongodump)

Run the following command to create a full backup of the MongoDB database:
- mongodump --uri="your_full_mongo_uri" --out=./dump
This will create a folder called dump/ with a full export of your database.

### 🔄 Restore from Backup (mongorestore)
To restore the database from your dump:
- mongorestore --uri="your_full_mongo_uri" ./dump

---

## 📜 License

This project is licensed under the MIT License — feel free to use, share, and modify!

---

## 🙌 Authors

**Andy McGann** - @mcgandrew
**Isaiah Doan** - @IsaiahD9402
**Andrew Varkey** - @Drewski03
