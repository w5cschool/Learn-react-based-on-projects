import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();// 防止页面刷新
    // trim() 后的结果如果是空字符串 ""，在 JavaScript 里会被当成 false，
    // 所以如果输入为空，则返回。
    if (!text.trim()) return;

    setTodos([
      ...todos,
      { id: crypto.randomUUID(), text: text.trim(), done: false },
    ]);
    setText("");
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <main className="todo-app">
      <h1>Todo List</h1>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="输入任务后按回车"
        />    
        <button type="submit">添加</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          // className 用于设置样式，todo.done 为 true 时，设置为 done 类，否则为空。
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>

            <button onClick={() => removeTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>

      <p className="todo-counter">
        剩余 {todos.filter((todo) => !todo.done).length} 个任务
      </p>
    </main>
  );
}

export default App;