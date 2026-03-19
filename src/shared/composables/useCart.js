import { computed, ref, watch } from 'vue'
import { getStorage, removeStorage, setStorage } from '../../storage/index.js'
import { useUser } from './useUser.js'

const CART_KEY_PREFIX = 'shopping_cart_'

const { currentUser } = useUser()
const cartItems = ref([])

const cartStorageKey = computed(() => {
  if (!currentUser.value) {
    return ''
  }

  return `${CART_KEY_PREFIX}${currentUser.value.id}`
})

function loadCart() {
  if (!cartStorageKey.value) {
    cartItems.value = []
    return
  }

  cartItems.value = getStorage(cartStorageKey.value, [])
}

function saveCart() {
  if (!cartStorageKey.value) {
    return
  }

  setStorage(cartStorageKey.value, cartItems.value)
}

watch(currentUser, loadCart, { immediate: true })

export function useCart() {
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  function addToCart(product, quantity = 1) {
    if (!currentUser.value) {
      return {
        success: false,
        message: '请先登录后再加入购物车',
      }
    }

    if (!product || !product.id) {
      return {
        success: false,
        message: '商品信息无效',
      }
    }

    const nextQuantity = Math.max(1, Number(quantity) || 1)
    const existedItem = cartItems.value.find((item) => item.productId === product.id)
    const currentQuantity = existedItem ? existedItem.quantity : 0
    const targetQuantity = currentQuantity + nextQuantity

    if (targetQuantity > product.stock) {
      return {
        success: false,
        message: '加入数量不能超过库存',
      }
    }

    if (existedItem) {
      existedItem.quantity = targetQuantity
    } else {
      cartItems.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: nextQuantity,
      })
    }

    saveCart()

    return {
      success: true,
      message: '已加入购物车',
    }
  }

  function updateQuantity(productId, quantity) {
    const targetItem = cartItems.value.find((item) => item.productId === productId)

    if (!targetItem) {
      return {
        success: false,
        message: '购物车中没有该商品',
      }
    }

    const nextQuantity = Number(quantity)

    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
      removeFromCart(productId)
      return {
        success: true,
        message: '商品已从购物车移除',
      }
    }

    if (nextQuantity > targetItem.stock) {
      return {
        success: false,
        message: '修改数量不能超过库存',
      }
    }

    targetItem.quantity = nextQuantity
    saveCart()

    return {
      success: true,
      message: '购物车数量已更新',
    }
  }

  function removeFromCart(productId) {
    cartItems.value = cartItems.value.filter((item) => item.productId !== productId)
    saveCart()

    return {
      success: true,
      message: '商品已从购物车移除',
    }
  }

  function clearCart() {
    cartItems.value = []

    if (cartStorageKey.value) {
      removeStorage(cartStorageKey.value)
    }

    return {
      success: true,
      message: '购物车已清空',
    }
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
}
