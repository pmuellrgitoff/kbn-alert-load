'use strict'

const https = require('https')
const axios = require('axios').default
const pkg = require('../package.json')
const { retry } = require('./utils')

module.exports = {
  createRule,
  createConnector,
  getKbStatus,
  getKbTaskManagerStatus,
}

const ruleTypeId = '.index-threshold'
const connectorTypeId = '.index'

const axiosConfig = {
  headers: {
    'kbn-xsrf': `${pkg.name}@${pkg.version}`,
    'content-type': 'application/json',
  },
  httpsAgent: new https.Agent ({
    rejectUnauthorized: false
  })
}

const httpClient = axios.create(axiosConfig)

/** @type { (kbUrl: string, name: string, inputIndex: string, firing: boolean, actions: Array<{ id: string, group: string, params: any }>) => Promise<string> } */
async function createRule(kbUrl, name, inputIndex, firing = false, actions = []) {
  /** @type {any} */
  const data = {
    enabled: true,
    name,
    rule_type_id: ruleTypeId,
    consumer: 'alerts',
    schedule: { interval: '3s' },
    actions,
    notify_when: 'onActiveAlert',
    params: {
      index: '.kibana-event-log*',
      timeField: '@timestamp',
      aggType: 'count',
      groupBy: 'all',
      termSize: 5,
      timeWindowSize: 5,
      timeWindowUnit: 'm',
      thresholdComparator: firing ? '>' : '<',
      threshold: [-1],
    },
  }

  const response = await retry(120, 5, `creating rule`, async () => 
    await httpClient.post(`${kbUrl}/api/alerting/rule`, data)
  )

  const { id } = response.data || {}
  return id
}

/** @type { (kbUrl: string, name: string, outputIndex: string) => Promise<string> } */
async function createConnector(kbUrl, name, outputIndex) {
  /** @type {any} */
  const data = {
    name,
    connector_type_id: connectorTypeId,
    config: {
      index: outputIndex,
      executionTimeField: '@timestamp',
    },
  }

  const response = await retry(120, 5, `creating connector`, async () =>
    await httpClient.post(`${kbUrl}/api/actions/connector`, data)
  )

  const { id } = response.data || {}
  return id
}

/** @type { (kbUrl: string) => Promise<any> } */
async function getKbStatus(kbUrl) {
  const response = await retry(10, 2, `getting kibana status`, async () =>
    await httpClient.get(`${kbUrl}/api/status`)
  )
  return response.data || {}
}

/** @type { (kbUrl: string) => Promise<any> } */
async function getKbTaskManagerStatus(kbUrl) {
  const response = await retry(10, 2, `getting kibana Task Manager status`, async () =>
    await httpClient.get(`${kbUrl}/api/task_manager/_health`)
  )
  return response.data || {}
}

// @ts-ignore
if (require.main === module) test()

async function test() {
  const url = 'https://elastic:changeme@localhost:5601'
  const name = __filename
  const inputIndex = `${pkg.name}-rule-input`
  try {
    const id = await createRule(url, name, inputIndex)
    console.log(`created rule:`, id)
  } catch (err) {
    const { status, statusText, data} = err.response
    console.log('error:', status, statusText)
    console.log(JSON.stringify(data, null, 4))
  }
}