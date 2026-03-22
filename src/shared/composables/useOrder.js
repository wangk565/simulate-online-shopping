import { computed, ref, watch } from 'vue'
import { getStorage, setStorage } from '../../storage/index.js'
import { useUser } from './useUser.js'

const ORDER_KEY_PREFIX = 'shopping_orders_'

const { currentUser } = useUser()
const orders = ref([])

const orderStorageKey = computed(() => {
  if (!currentUser.value) {
    return ''
  }

  return `${ORDER_KEY_PREFIX}${currentUser.value.id}`
})

function loadOrders() {
  if (!orderStorageKey.value) {
    orders.value = []
    return
  }

  orders.value = getStorage(orderStorageKey.value, [])
}

function saveOrders() {
  if (!orderStorageKey.value) {
    return
  }

  setStorage(orderStorageKey.value, orders.value)
}

function generateOrderId() {
  return `order_${Date.now()}`
}

watch(currentUser, loadOrders, { immediate: true })

export function useOrder() {
  const orderList = computed(() => {
    return [...orders.value].sort((firstOrder, secondOrder) => {
      return new Date(secondOrder.createdAt).getTime() - new Date(firstOrder.createdAt).getTime()
    })
  })

  function createOrder(orderData) {
    if (!currentUser.value) {
      return {
        success: false,
        message: '请先登录后再提交订单',
      }
    }

    if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return {
        success: false,
        message: '订单商品不能为空',
      }
    }

    const newOrder = {
      id: generateOrderId(),
      userId: currentUser.value.id,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      receiverName: orderData.receiverName || currentUser.value.username,
      phone: orderData.phone || currentUser.value.phone || '',
      address: orderData.address || currentUser.value.address || '',
      status: '待付款',
      logisticsStatus: '待发货',
      createdAt: new Date().toISOString(),
    }

    orders.value.unshift(newOrder)
    saveOrders()

    return {
      success: true,
      message: '订单已创建',
      order: newOrder,
    }
  }

  function getOrderById(orderId) {
    return orders.value.find((order) => order.id === orderId) || null
  }

  function updateOrderStatus(orderId, status) {
    const targetOrder = orders.value.find((order) => order.id === orderId)

    if (!targetOrder) {
      return {
        success: false,
        message: '未找到该订单',
      }
    }

    targetOrder.status = status
    saveOrders()

    return {
      success: true,
      message: '订单状态已更新',
      order: targetOrder,
    }
  }

  function updateLogisticsStatus(orderId, logisticsStatus) {
    const targetOrder = orders.value.find((order) => order.id === orderId)

    if (!targetOrder) {
      return {
        success: false,
        message: '未找到该订单',
      }
    }

    targetOrder.logisticsStatus = logisticsStatus
    saveOrders()

    return {
      success: true,
      message: '物流状态已更新',
      order: targetOrder,
    }
  }

  function confirmReceipt(orderId) {
    const targetOrder = orders.value.find((order) => order.id === orderId)

    if (!targetOrder) {
      return {
        success: false,
        message: '未找到该订单',
      }
    }

    targetOrder.status = '已完成'
    targetOrder.logisticsStatus = '已签收'
    saveOrders()

    return {
      success: true,
      message: '已确认收货',
      order: targetOrder,
    }
  }

  return {
    orders: orderList,
    createOrder,
    getOrderById,
    updateOrderStatus,
    updateLogisticsStatus,
    confirmReceipt,
  }
}
