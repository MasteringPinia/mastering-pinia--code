import TestComponent from '../index.vue'
import { mount } from '@vue/test-utils'
import { getRouter } from 'vue-router-mock'
import { getMemes } from '~/api/memes'
import { metaFetchingGuard } from '../navigation-guard'
import { mockHttpRequests } from '@tests/mocks/server'
import getMemesResponse from '@tests/fixtures/api.imgflip-getMemes.json'
import { describe, beforeEach, it, expect } from 'vitest'

describe('0X [Routing]: Data fetching with Meta', () => {
  mockHttpRequests()

  beforeEach(async () => {
    const router = getRouter()
    router.reset()
    router.beforeResolve(to => {
      to.meta.apiCall = getMemes
    })
    router.beforeResolve(metaFetchingGuard)
    await router.push('/')
  })

  it('fetch when working', async () => {
    const wrapper = mount(TestComponent)

    const figures = wrapper.findAll('figure')
    expect(figures).toHaveLength(getMemesResponse.data.memes.length)
  })
})
