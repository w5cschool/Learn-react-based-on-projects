
---

## 结论先行：事件循环一句话

**JS 只有一个主线程，所有代码都排队执行；异步不是“并行执行”，而是“把回调排进队列，等主线程空了再执行”。**

---

## 你必须记住的 4 个角色（80/20）

1. **Call Stack（调用栈）**：同步代码在这里一层层执行
2. **Web APIs（浏览器/Node 能力）**：定时器、网络、DOM 事件在这里“等待完成”
3. **Task Queue（宏任务队列）**：setTimeout、setInterval、UI 事件、I/O 等
4. **Microtask Queue（微任务队列）**：Promise.then/catch/finally、queueMicrotask、（浏览器里还有 MutationObserver）

---

## 事件循环的规则（背下来就通了）

每一轮循环（tick）：

1. 执行一个 **宏任务**（通常是脚本整体、或一个 setTimeout 回调）
2. 把调用栈清空后，**立刻清空所有微任务**（微任务会一直执行到队列为空）
3. 需要的话进行一次渲染（浏览器）
4. 进入下一轮宏任务

**口诀：宏任务跑一段 → 微任务清空 → 再下一段宏任务。**

---

## 一段经典题：你一眼能说出输出顺序吗？

```js
console.log(1);

setTimeout(() => console.log(2), 0);

Promise.resolve().then(() => console.log(3));

console.log(4);
```

执行顺序（按规则推）：

* 同步进栈：1、4
* setTimeout 回调进 **宏任务队列**
* Promise.then 回调进 **微任务队列**
* 当前宏任务（整段脚本）结束 → 清空微任务：3
* 下一轮宏任务：2

✅ 输出：**1 4 3 2**

---

## 再来一段：微任务会“插队”到宏任务前

```js
setTimeout(() => console.log('T1'), 0);

Promise.resolve()
  .then(() => {
    console.log('P1');
    setTimeout(() => console.log('T2'), 0);
  })
  .then(() => console.log('P2'));

console.log('S');
```

推演：

* 同步：S
* 微任务：P1（里面又塞了 T2 宏任务）
* 继续清空微任务：P2
* 下一轮宏任务：T1
* 再下一轮宏任务：T2

✅ 输出：**S P1 P2 T1 T2**

---

## async/await 的底层真相（最关键一句）

**await 之后的代码，本质上等价于 “Promise.then 里的代码” → 也就是微任务。**

例子：

```js
async function f() {
  console.log('A');
  await 0;
  console.log('B');
}
f();
console.log('C');
```

* 同步：A、C
* await 后续（B）进微任务
* 清空微任务：B

✅ 输出：**A C B**

> await 不是“阻塞线程”，它是“切一刀：后半段改成微任务回调”。

---

## 反演法：你最容易踩坑的失败模式

1. **以为 setTimeout(0) 立刻执行**
   实际：它只是“最早下一轮宏任务”
2. **以为 Promise.then 是异步里最慢的**
   实际：Promise.then 是“微任务”，通常比 setTimeout 更早执行
3. **以为 await 会卡住整个 JS**
   实际：await 只暂停当前 async 函数，主线程继续跑别的同步代码

---

## 和你项目最相关的“护城河用法”

在 React/Next 里，理解事件循环能让你：

* 不再被“状态更新顺序/批处理”搞晕（本质就是队列+时机）
* 更会做性能优化（把重任务切片到宏任务、把依赖顺序放微任务）
* 更快定位“偶现 bug”（竞态条件几乎都和队列时序有关）

---