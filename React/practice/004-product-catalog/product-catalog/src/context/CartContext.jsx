// src/context/CartContext.jsx
import { createContext, useContext, useMemo, useReducer } from 'react'

// create a context for the cart
const CartContext = createContext(null)

// initial state
const initialState = {
  items: [],
}

// create a reducer for the cart, to handle the cart state, based on the action type
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      // 获取商品和数量
      const { product, quantity = 1 } = action.payload
      // 查找是否已经存在该商品
      const existing = state.items.find((item) => item.id === product.id)
      // 如果存在，则更新数量

      if (existing) {
        // 更新数量
        return {
          ...state,
          // 更新商品数量
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        }
      }

      // 如果不存在，则添加商品
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...product,
            quantity,
          },
        ],
      }
    }

    case 'REMOVE_ITEM': {
      const { id } = action.payload
      return {
        ...state,
        items: state.items.filter((item) => item.id !== id),
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity < 1) {
        return state
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      }
    }

    case 'CLEAR_CART':
      return initialState

    default:
      return state
  }
}

// create a CartProvider, to provide the cart state
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const { cartCount, cartTotal } = useMemo(() => {
    const cartCount = state.items.reduce(
      (total, item) => total + item.quantity,
      0,
    )
    const cartTotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    )

    return {
      cartCount,
      cartTotal: Number(cartTotal.toFixed(2)),
    }
  }, [state.items])

  const value = useMemo(
    () => ({
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [state.items, cartCount, cartTotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// create a useCart, to get the cart state
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}