# DevKanban v2.1.0 🚀

A **high-performance Developer Kanban Board** built with **Vanilla JavaScript (ES6+), HTML, and CSS**, optimized for **60fps animations**, **drag-and-drop task management**, and **localStorage persistence**.  

The UI is styled like a **developer terminal**, with a boot sequence, ASCII art, and command-like task creation.

---

## ✨ Features

- **Terminal-style Boot Sequence**
  - Simulated initialization logs
  - ASCII art banner
  - Progress bar animation

- **Dynamic Task Management**
  - Create tasks with `title` and `description`
  - Automatic **priority & tags detection**
  - Tasks stored in browser `localStorage`

- **Drag and Drop Board**
  - Move tasks across **TODO → IN_PROGRESS → DONE**
  - Smooth drag-and-drop interactions
  - Real-time task status update

- **Performance Monitoring**
  - FPS counter in header
  - Render time tracker

- **Responsive Design**
  - Works seamlessly on desktop and mobile
  - Dark-themed **terminal-style interface**

---

## 📂 Project Structure

```

📦 dev-kanban-board
┣ 📜 index.html     # Main HTML structure
┣ 📜 style.css      # Styling and dark-theme UI
┣ 📜 app.js         # Core application logic (modules & events)
┣ 📜 README.md      # Documentation
┗ 📜 LICENSE        # (Optional) Open-source license

````

---

## ⚡ Technologies Used

- **HTML5** (semantic structure)
- **CSS3** (modern design, responsive, dark mode)
- **JavaScript (ES6+)** (modular architecture, localStorage, drag-and-drop API)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/dev-kanban-board.git
cd dev-kanban-board
````

### 2. Open in Browser

Simply open `index.html` in your browser:

```bash
open index.html
```

*No build steps required — this is a pure Vanilla JS app.*

---

## 🛠️ How to Use

1. **Boot Sequence**

   * When the app loads, a boot animation sequence runs before launching the board.

2. **Create a Task**

   * Use the `create-task` form (title is required).
   * Optionally add a description.
   * Click **Execute** or press **Enter**.

3. **Manage Tasks**

   * Drag tasks between **TODO → IN\_PROGRESS → DONE**.
   * Delete a task using the ❌ button.
   * Task counts update automatically.

4. **Performance Monitor**

   * The header shows **FPS** and total **task count**.
   * Render time (ms) shown at bottom.

---

## 🔮 Roadmap

* [ ] Task editing & inline updates
* [ ] Search and filter tasks
* [ ] Export / Import tasks (JSON)
* [ ] Multi-user collaboration (future version)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m "Add new feature"`)
4. Push branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Keshav Sharma**

* [GitHub](https://github.com/keshavsharma02)
* [LinkedIn](https://www.linkedin.com/in/keshavsharma02)
* [LeetCode](https://leetcode.com/u/keshavsharma6393/)

---

### ⭐ If you like this project, don’t forget to **star the repo** on GitHub!

```
