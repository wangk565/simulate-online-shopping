import { computed, ref, watch } from 'vue'
import { getStorage, setStorage } from '../../../storage/index.js'
import { useUser } from '../../../shared/composables/useUser.js'

const LOGISTICS_KEY_PREFIX = 'shopping_logistics_'

const { currentUser } = useUser()
const logisticsRecords = ref([])

const logisticsStorageKey = computed(() => {
  if (!currentUser.value) {
    return ''
  }

  return `${LOGISTICS_KEY_PREFIX}${currentUser.value.id}`
})

function loadLogistics() {
  if (!logisticsStorageKey.value) {
    logisticsRecords.value = []
    return
  }

  logisticsRecords.value = getStorage(logisticsStorageKey.value, [])
}

function saveLogistics() {
  if (!logisticsStorageKey.value) {
    return
  }

  setStorage(logisticsStorageKey.value, logisticsRecords.value)
}

function createTimeline(baseTime) {
  const base = new Date(baseTime)

  return [
    {
      status: '已发货',
      time: new Date(base.getTime() + 30 * 60 * 1000).toISOString(),
      description: '商家已经完成打包，包裹正在发出。',
    },
    {
      status: '运输中',
      time: new Date(base.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      description: '包裹正在运输途中，请耐心等待。',
    },
    {
      status: '派送中',
      time: new Date(base.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      description: '配送员正在派送，商品即将送达。',
    },
    {
      status: '已签收',
      time: new Date(base.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      description: '包裹已完成签收，订单已结束。',
    },
  ]
}

watch(currentUser, loadLogistics, { immediate: true })

export function useLogistics() {
  function getLogistics(orderId) {
    return logisticsRecords.value.find((record) => record.orderId === orderId) || null
  }

  function generateLogistics(order) {
    if (!currentUser.value) {
      return {
        success: false,
        message: '请先登录后再生成物流信息',
      }
    }

    if (!order?.id) {
      return {
        success: false,
        message: '订单信息无效',
      }
    }

    const existedRecord = getLogistics(order.id)

    if (existedRecord) {
      return {
        success: true,
        message: '物流信息已存在',
        logistics: existedRecord,
      }
    }

    const logistics = {
      orderId: order.id,
      currentStatus: order.status === '已完成' ? '已签收' : '派送中',
      timeline: createTimeline(order.createdAt || new Date().toISOString()),
    }

    logisticsRecords.value.unshift(logistics)
    saveLogistics()

    return {
      success: true,
      message: '物流信息已生成',
      logistics,
    }
  }

  function updateLogisticsCurrentStatus(orderId, currentStatus) {
    const targetRecord = getLogistics(orderId)

    if (!targetRecord) {
      return {
        success: false,
        message: '未找到该订单物流信息',
      }
    }

    targetRecord.currentStatus = currentStatus
    saveLogistics()

    return {
      success: true,
      message: '物流进度已更新',
      logistics: targetRecord,
    }
  }

  return {
    getLogistics,
    generateLogistics,
    updateLogisticsCurrentStatus,
  }
}
