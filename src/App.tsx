import React, { useState, useEffect, useRef } from "react";
import "./App.css";

declare global {
  interface Window {
    electronAPI: {
      dragWindow: (x: number, y: number) => void;
      closeApp: () => void;
      showContextMenu: () => void;
      onChangeAction: (callback: (action: string) => void) => void;
      onSaySomething: (callback: () => void) => void;
    };
  }
}

type Action = "idle" | "walk" | "sit" | "sleep";

const App: React.FC = () => {
  const [action, setAction] = useState<Action>("idle");
  const [message, setMessage] = useState("你好呀~");
  const [showMessage, setShowMessage] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const messages: Record<Action, string[]> = {
    idle: ["凤~~", "陪我玩会吧~", "无聊ing..."],
    walk: ["散步中~", "走走停停~", "到处看看~"],
    sit: ["坐着休息~", "累了呢~", "歇会儿~"],
    sleep: ["Zzz...", "好困...", "睡着了~"],
  };

  // 监听主进程的动作切换指令
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onChangeAction((newAction: string) => {
        setAction(newAction as Action);
        const randomMessage =
          messages[newAction as Action][
            Math.floor(Math.random() * messages[newAction as Action].length)
          ];
        setMessage(randomMessage);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      });

      window.electronAPI.onSaySomething(() => {
        const randomMessage =
          messages[action][Math.floor(Math.random() * messages[action].length)];
        setMessage(randomMessage);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      });
    }
  }, [action]);

  // 随机切换动作
  useEffect(() => {
    const actions: Action[] = ["idle", "walk", "sit", "sleep"];

    const timer = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setAction(randomAction);
      const randomMessage =
        messages[randomAction][
          Math.floor(Math.random() * messages[randomAction].length)
        ];
      setMessage(randomMessage);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    // 添加dragging类
    if (containerRef.current) {
      containerRef.current.classList.add("dragging");
    }

    // 使用原生事件监听器避免React重新渲染
    const handleMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      if (window.electronAPI) {
        const deltaX = moveEvent.clientX - dragStartPos.current.x;
        const deltaY = moveEvent.clientY - dragStartPos.current.y;
        window.electronAPI.dragWindow(deltaX, deltaY);
        dragStartPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
      }
    };

    const handleUp = () => {
      // 移除dragging类
      if (containerRef.current) {
        containerRef.current.classList.remove("dragging");
      }
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.electronAPI) {
      window.electronAPI.showContextMenu();
    }
  };

  return (
    <div
      ref={containerRef}
      className="pet-container"
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <div className={`message-bubble ${showMessage ? "show" : ""}`}>
        {message}
      </div>
      <div className={`pet pet-${action}`}>
        <div className="pet-ears">
          <div className="pet-ear left"></div>
          <div className="pet-ear right"></div>
        </div>
        <div className="pet-head">
          <div className="pet-face">
            <div className="pet-eyes">
              <div className="pet-eye left"></div>
              <div className="pet-eye right"></div>
            </div>
            <div className="pet-nose"></div>
            <div className="pet-mouth"></div>
          </div>
        </div>
      </div>
      <div className="hint">右键菜单</div>
    </div>
  );
};

export default App;
