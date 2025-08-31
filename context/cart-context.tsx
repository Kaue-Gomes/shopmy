'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product } from '@prisma/client'

interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.product.id === action.payload.product.id
      )

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === action.payload.product.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        total,
        itemCount,
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => item.product.id !== action.payload.productId
      )
      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        total,
        itemCount,
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        total,
        itemCount,
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      }

    case 'LOAD_CART': {
      const total = action.payload.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
      const itemCount = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0
      )

      return {
        items: action.payload,
        total,
        itemCount,
      }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
      }
    }
  }, [])

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}
