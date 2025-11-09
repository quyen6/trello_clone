# **Trello**

A simple *Trello-like task management application* built with *React.js (Frontend)* and *Node.js + Express (Backend)*.  
This project demonstrates **drag-and-drop boards, authentication, real-time collaboration, drag-and-drop reordering, role-based access control, and a clean UI**.

**[Live Demo](https://trellodnd.netlify.app/)**

**Account demo:**

- Account1 test:
  - Account: user1@gmail.com
  - Password: 12345678a
- Account2 test:
  - Account: user2@gmail.com
  - Password: 12345678a

_(for testing realtime notification, update & move column, card)_
<p align="center">
  <img src="https://github.com/user-attachments/assets/5207848b-b035-4c33-9741-c38a7fe953b7" width="45%"/>
  <img src="https://github.com/user-attachments/assets/0ce93cc5-564a-4859-998f-4b8dd92fc2cb" width="45%"/>
</p>

---
## ► Key Features
1. Authentication & Authorization
   - Register & Login: Users can register with an email and a password or login with account Google, Github.
   - Email Verification: To enhance security, users must verify their email address. A verification link is sent via email (using Brevo), and the account remains inactive until it’s confirmed.
2. Real-time Features
   - Live board updates: Changes to cards or columns reflect instantly across all users’ screens.
   - Notifications: Users receive real-time notifications when tasks are updated or moved.
3. Role-Based Access Control (RBAC)
   - Admin: Can manage users, assign roles, and modify all boards.
   - Manager: Similar to Admin but with some restricted permissions.
   - Member: Can create, edit, and delete cards or columns.
4. Drag-and-Drop Functionality
   - Rearrange columns and cards easily using intuitive drag-and-drop.
   - Updates are synced in real-time with all collaborators.


## ► Technologies Used

### **Backend**
- **Framework:** Nodejs, Expressjs
- **Database:** MongoDB
- **Real-time:** Socket.io
- **External Services:**
  - **Cloudinary:** Image hosting and optimization
  - **Passportjs:** Authentication middleware, third-party login integration
 
### **Frontend**

- **Library:** ReactJS 
- **Build Tool:** Vite
- **State Management:** MobX
- **Routing:** React Router
- **UI Library:** Material-UI (MUI)
- **HTTP Client:** Axios

### **Deloyment**

- **Platform:** Render, Netlify

## ► Getting Started Locally

### **Requirements**
  - Node.js (v18 or higher)
  - Brevo account
  - MongoDB (local or cloud instance, e.g. MongoDB Atlas)
### **1. Backend Setup**

1. Clone the backend repository
   ```bash
   git clone https://github.com/quyen6/trello-api.git
   cd trello-api
   ```
2. Install dependencies
   ```bash
   npm install
   Or: yarn add
   ```
3. Set up environment variables
Create a .env file in the root of the backend folder and add:
    ```bash
    MONGODB_URI=
    DATABASE_NAME=
    LOCAL_DEV_APP_HOST=
    LOCAL_DEV_APP_PORT=

    AUTHOR =

    WEBSITE_DOMAIN_DEVELOPMENT = 
    WEBSITE_DOMAIN_PRODUCTION =

    BACKEND_DOMAIN_DEVELOPMENT =
    BACKEND_DOMAIN_PRODUCTION = 

    BREVO_API_KEY =
    ADMIN_EMAIL_ADDRESS = 
    ADMIN_EMAIL_NAME = 

    ACCESS_TOKEN_SECRET_SIGNATURE =
    ACCESS_TOKEN_LIFE = 

    REFRESH_TOKEN_SECRET_SIGNATURE = 
    REFRESH_TOKEN_LIFE =

    CLOUDINARY_CLOUD_NAME =
    CLOUDINARY_API_KEY =
    CLOUDINARY_API_SCERET= 

    GOOGLE_CLIENTID = 
    GOOGLE_CLIENTSECRECT= 

    GITHUB_CLIENTID_DEV = 
    GITHUB_CLIENTSECRET_DEV= 
    GITHUB_CLIENTID_PROD = 
    GITHUB_CLIENTSECRET_PROD=

4. Run the backend server
    ```bash
    npm run dev
    Or: yarn dev
    ```
Backend server will run at: http://localhost:8017

### **2. Frontend Setup**

1. Clone the backend repository
   ```bash
   git clone https://github.com/quyen6/trello-web.git
   cd trello-web
   ```
2. Install dependencies
   ```bash
   npm install
   Or: yarn add
   ```
3.  Start the frontend:
    ```bash
    npm run dev
    Or: yarn dev
    ```
    Frontend will run at `http://localhost:5317`.


