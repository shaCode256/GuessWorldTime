
# 🌍 World Time Guessing Game

World Time is a fun web-based guessing game where users try to guess the **current time** in different cities around the world!  
If they guess correctly, their win is recorded, and they get a cool confetti effect! 🎉

---

## 🚀 Features

🌎 Fetches real-time world clock data for different cities.  
⏳ Users guess the time and get rewarded for correct answers.  
🎉 Confetti effect when guessing correctly.  
🖼️ Aesthetic design with background and animations.  
🖥️ FastAPI backend with MongoDB for storing winning guesses.  
✅ Unit tests to ensure everything works correctly.  
🔄 Client and server run with a single command.  
🌐 RTL & LTR layout support based on the selected language.  
🌍 Localization:  
Supports both English and Hebrew.  
Buttons to switch between the two languages.  
Text updates dynamically based on selection.  
📱 Fully responsive design for smooth display on different screen sizes.  

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/shaCode256/GuessWorldTime.git
cd GuessWorldTime
```

### **2️⃣ Set Up Backend (FastAPI)**
#### **Install dependencies**
```bash
pip install -r requirements.txt
```

#### **Run the server**
```bash
uvicorn backend:app --reload
```
By default, the backend runs on **http://127.0.0.1:8000/**.

---

### **3️⃣ Set Up Frontend (React)**
#### **Navigate to frontend folder**
```bash
cd frontend
```

#### **Install dependencies**
```bash
npm install
```

#### **Run React App**
```bash
npm start
```
The frontend runs on **http://localhost:3000/**.

---

#### **Run both the server and client in one command**
```bash
cd frontend; npm run dev



## 📡 API Endpoints

### **📝 Get List of Available Locations**
```
GET /locations
```
📌 **Response:**
```json
["Tel Aviv", "Jerusalem", "Haifa", "New York", "London"]
```

---

### **🎯 Submit a Guess**
```
POST /guess
```
📌 **Request Body:**
```json
{
  "location": "Tel Aviv",
  "guessed_time": "10:30 AM"
}
```
📌 **Response (if correct guess):**
```json
{
  "message": "Winning guess submitted and stored!"
}
```
📌 **Response (if incorrect guess):**
```json
{
  "message": "Non-winning guess ignored"
}
```

---

### **📊 Fetch Winning Guesses**
```
GET /results
```
📌 **Response Example:**
```json
[
  {"location": "Tel Aviv", "guessed_time": "10:30 AM"}
]
```

---

## 🧪 Running Tests
We use `pytest` for backend testing.

#### **Run tests**
```bash
pytest test_backend.py
```

✅ The tests will check:
- If the locations API works.
- If the winning guesses are stored.
- If incorrect guesses are ignored.
- If results return correctly.

---

## 📸 Screenshot
![GuessWorldTime](WT.gif?raw=true "World Time")
![Alt text](screenshot.jpg?raw=true "World Time")

---

## 🤝 Contributing
Feel free to **fork** this project and submit pull requests! 😊  

---

## 📜 License
This project is open-source and available under the **MIT License**.
