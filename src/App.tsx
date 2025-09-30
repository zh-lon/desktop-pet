import React, { useState, useEffect, useRef } from 'react';
import './App.css';

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

type Action = 'idle' | 'walk' | 'sit' | 'sleep';

const App: React.FC = () => {
  const [action, setAction] = useState<Action>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState('你好呀~');
  const [showMessage, setShowMessage] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const messages: Record<Action, string[]> = {
    idle: ['在干嘛呢~', '陪我玩会吧~', '无聊ing...'],
    walk: ['散步中~', '走走停停~', '到处看看~'],
    sit: ['坐着休息~', '累了呢~', '歇会儿~'],
    sleep: ['Zzz...', '好困...', '睡着了~']
  };

  // 监听主进程的动作切换指令
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onChangeAction((newAction: string) => {
        setAction(newAction as Action);
        const randomMessage = messages[newAction as Action][
          Math.floor(Math.random() * messages[newAction as Action].length)
        ];
        setMessage(randomMessage);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      });

      window.electronAPI.onSaySomething(() => {
        const randomMessage = messages[action][
          Math.floor(Math.random() * messages[action].length)
        ];
        setMessage(randomMessage);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      });
    }
  }, [action]);

  // 随机切换动作
  useEffect(() => {
    const actions: Action[] = ['idle', 'walk', 'sit', 'sleep'];

    const timer = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setAction(randomAction);
      const randomMessage = messages[randomAction][
        Math.floor(Math.random() * messages[randomAction].length)
      ];
      setMessage(randomMessage);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && window.electronAPI) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      window.electronAPI.dragWindow(deltaX, deltaY);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.electronAPI) {
      window.electronAPI.showContextMenu();
    }
  };

  return (
    <div
      className="pet-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <div className={`message-bubble ${showMessage ? 'show' : ''}`}>{message}</div>
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
        <div className="pet-body">
          <div className="pet-arm left"></div>
          <div className="pet-arm right"></div>
          <div className="pet-leg left"></div>
          <div className="pet-leg right"></div>
        </div>
      </div>
      <div className="hint">右键菜单</div>
    </div>
  );
};

export default App;
