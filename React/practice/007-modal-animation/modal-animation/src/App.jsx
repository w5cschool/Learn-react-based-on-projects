import { useState } from 'react'
import './App.css'

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 })

  const handleButtonClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    // 获取按钮中心点的坐标
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    // 计算从屏幕中心到点击位置的偏移量
    const offsetX = x - window.innerWidth / 2
    const offsetY = y - window.innerHeight / 2
    setClickPosition({ x, y, offsetX, offsetY })
    setIsClosing(false)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsClosing(true)
    // 等待关闭动画完成后再移除元素
    setTimeout(() => {
      setIsModalOpen(false)
      setIsClosing(false)
    }, 400) // 与关闭动画时长一致
  }

  return (
    <div className="app-container">
      <h1>弹窗动画效果</h1>
      <p className="sub">点击按钮，弹窗会从按钮位置弹出并逐渐放大</p>
      
      <div className="button-container">
        <button className="trigger-button" onClick={handleButtonClick}>
          点击打开弹窗
        </button>
      </div>

      {isModalOpen && (
        <>
          <div 
            className={`modal-overlay ${isClosing ? 'closing' : ''}`}
            onClick={handleCloseModal}
          ></div>
          <div 
            className={`modal-content ${isClosing ? 'closing' : ''}`}
            style={{
              '--offset-x': `${clickPosition.offsetX || 0}px`,
              '--offset-y': `${clickPosition.offsetY || 0}px`,
            }}
          >
            <div className="modal-header">
              <h2>弹窗标题</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>这是一个从点击位置弹出的弹窗动画效果。</p>
              <p>弹窗会从鼠标点击位置开始，逐渐放大直到完全显示。</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={handleCloseModal}>
                确定
              </button>
              <button className="modal-button secondary" onClick={handleCloseModal}>
                取消
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

