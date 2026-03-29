# TeamSync Frontend Guide

This guide breaks down the core concepts, architecture, and "why" behind the code we wrote for the TeamSync Kanban application. Use this to master the codebase for interviews.

## 1. Project Structure

We organized the code to separate concerns, making the app scalable and maintainable.

-   **`src/api/`**: Contains the networking logic. Instead of calling `axios.get` directly in components, we wrap it here to handle configuration (base URLs) and interceptors globally.
-   **`src/context/`**: Holds global state managers. We use `AuthContext.jsx` here to ensure the user's login state is accessible from *any* component without passing props down manually.
-   **`src/components/`**: Examples of "Feature-based" organization.
    -   **Pure/dumb components**: `TaskCard` (just renders data).
    -   **Smart components**: `Board` (handles logic/API) and `Login` (handles auth).
    -   **Layouts**: `Dashboard` (defines the page structure).

---

## 2. Authentication Flow (Crucial)

This is a classic **JWT (JSON Web Token)** authentication flow.

### **The AuthContext (`src/context/AuthContext.jsx`)**
**Why context?**
We need to know if a user is logged in (to protect routes) and show their name in the Dashboard. Passing this info through every component as props would be "Props Drilling" hell. Context solves this by allowing `App.jsx` and `Dashboard.jsx` to just "subscribe" to the auth state.

**How it works:**
1.  **State**: We track `user` (data), `token` (JWT string), and `loading` (initial check).
2.  **Login**: When you login, we get a token from the backend.
3.  **Persistence**: We immediately `localStorage.setItem('token', token)`. This ensures if you refresh the page, you stay logged in.
4.  **Initialization**: Inside `useEffect`, we check `localStorage` when the app loads.

### **The Interceptor (`src/api/axios.js`)**
**What is it?**
Think of an "Interceptor" as a middleware for your frontend requests. It sits between your component and the actual network request.

**The "Why" - Interview Gold:**
Imagine you have 50 different API calls (Get Tasks, Create Task, Delete Task, Update Profile...).
*   **Without Interceptor**: You have to manually add `headers: { Authorization: 'Bearer ' + token }` to **every single one** of those 50 calls. It's repetitive and error-prone.
*   **With Interceptor**: We write the logic **once**.
    ```javascript
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`; // Auto-attach!
      return config;
    });
    ```
    Now, `api.get('/tasks')` "just works" automatically.

---

## 3. Drag and Drop Logic & Optimistic UI

Located in: `src/components/Board.jsx`

We used `@hello-pangea/dnd`. The magic happens in `handleDragEnd`.

### **The Problem**
Network requests take time (e.g., 200ms - 1 second). If we waited for the server to reply "OK" before moving the card on the screen, the drag would feel laggy and unresponsive.

### **The Solution: Optimistic UI**
We assume the server *will* succeed and update the screen **immediately**.

**Step-by-Step Breakdown:**
1.  **Stop Check**: `if (!destination)` check prevents errors if you drop outside a valid column.
2.  **Update State *First***:
    We map over the tasks array. When we find the moved task (`draggableId`), we change its `status` to the new column (`destination.droppableId`) locally.
    ```javascript
    setTasks(updatedTasks); // RE-RENDERS THE UI INSTANTLY!
    ```
    The user sees the card snap into place instantly. 0ms delay.
3.  **Send Request *Second***:
    ```javascript
    await api.put(...)
    ```
    We send the update to the backend in the background.
4.  **Error Handling (Rollback)**:
    If the API call fails (e.g., internet dies), we catch the error and revert the state or refetch tasks so the UI reflects reality.

---

## 4. Component Architecture

We usually move data in two ways:

1.  **Context (Global)**: Used for `Auth` because everything needs it.
2.  **Props (Parent-Child)**: Used for `Dashboard` -> `Board` -> `TaskCard`.

**Why Props for Tasks?**
The `Board` is the "owner" of the tasks data.
-   `Board` fetches the data.
-   `Board` passes specific task objects down to `TaskCard` via props.
-   `Board` creates the `handleDelete` function but passes it down to `TaskCard` so the card can trigger it.

This is **Lifting State Up**: The state lives in the common parent (`Board`), and the children (`TaskCard`) just receive data and functions to display/act on it.

---

## 5. Top 3 Interview Questions & Answers

### **Q1: "Why did you put the token in LocalStorage? Is it secure?"**
*   **Answer**: "I used LocalStorage for simplicity and persistence in this MVP so the user stays logged in on refresh. However, I know it is vulnerable to XSS (Cross-Site Scripting) attacks because any JS code on the page can read it. In a production banking app, I would use **HttpOnly Cookies**, which cannot be accessed by JavaScript, preventing XSS token theft."

### **Q2: "Explain the 'key' prop in your map function in Board.jsx. Why use `task._id` instead of `index`?"**
*   **Answer**: "React uses the `key` to track which items have changed, added, or removed. If I used `index`, and I deleted the first task, React would think the *second* task became the *first* (same index 0) and might not re-render correctly or would inefficiently update the DOM. Using `task._id` guarantees that the key is unique and stable to that specific data item, ensuring efficient and correct rendering."

### **Q3: "If two users are on the board, and one moves a card, does the other see it? How would you implement that?"**
*   **Answer**: "Currently, no. The other user would only see the change if they refresh (fetchTasks). To make it real-time, I would implement **WebSockets** (using Socket.io or SignalR). When User A moves a card, the backend would emit a `task-updated` event. User B's client would listen for that event and update their local state immediately without a refresh."
