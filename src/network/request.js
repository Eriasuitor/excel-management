import config from '../config/index'
import { message } from 'antd'
import document from '../containers/document/document'

const diffStatusAction = {
	500: () => {
		return '服务器出现意料之外的错误'
	},
	403: () => {
		return '权限不足'
	},
	400: () => {
		return '提交的数据不合法'
	},
	404: () => {
		return '功能已被迁移或永久移除'
	}
}

export function responseNot2StatusHandle(res, history, statusHandler = {}) {
	if (res.status < 200 || res.status >= 300) {
		const handler = statusHandler[res.status] || diffStatusAction[res.status]
		res.handleMessage = handler ? handler(history) : ""
		const error = new Error(res.message)
		error.res = res
		throw error
	}
}

export function responseStatusHandle(res, history, statusHandler = {}, isJSON = true) {
	responseNot2StatusHandle(res, history, statusHandler)
	if ([204, 205].includes(res.status)) {
		return null
	}
	if (isJSON) {
		return res.json()
	}
	return res.body
}

export function handleError(err) {
	let { res } = err
	message.warning((res && res.handleMessage) || ((res && res.status && '出现未被预见的错误，请联系软件售后。') || '服务器失联，请联系软件售后。'))
	throw err
}

export async function get(url, query = {}, history, statusHandler, isJSON = true) {
	Object.keys(query).forEach(key => (query[key] === undefined || query[key].length === 0) && delete query[key])
	let body = await fetch(`${config.host}${url}?${Object.keys(query).map(key => {
		if (Array.isArray(query[key])) {
			return query[key].map(value => `${key}[]=${value}`).join('&')
		}
		return `${key}=${query[key]}`
	}).join('&')}`, {
		method: 'GET'
	}).then(res => responseStatusHandle(res, history, statusHandler, isJSON)).catch(handleError)
	return body
}

export async function put(url, data = {}, history, statusHandler) {
	let body = await fetch(`${config.host}${url}`, {
		body: JSON.stringify(data),
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => responseStatusHandle(res, history, statusHandler)).catch(handleError)
	return body
}

export async function post(url, data = {}, history, statusHandler) {
	let body = await fetch(`${config.host}${url}`, {
		body: JSON.stringify(data),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => responseStatusHandle(res, history, statusHandler)).catch(handleError)
	return body
}

export async function remove(url, data = {}, history, statusHandler) {
	let body = await fetch(`${config.host}${url}`, {
		body: JSON.stringify(data),
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => responseStatusHandle(res, history, statusHandler)).catch(handleError)
	return body
}

export function getSystemInfo() {
	return get('/system/info')
}

export function addProject(project, statusHandler) {
	return post('/projects', project, undefined, statusHandler)
}

export function queryProjects(query) {
	return get('/projects', query)
}

export function updateProject(projectId, project) {
	return put(`/projects/${projectId}`, project)
}

export function removeProject(projectId) {
	return remove(`/projects/${projectId}`)
}

export function addLiquidityType(projectId, liquidityType, statusHandler) {
	return post(`/projects/${projectId}/liquidity-types`, liquidityType, undefined, {
		409: () => `已存在同名的收支类型`
	})
}

export function updateLiquidityType(liquidityTypeId, liquidityType) {
	return put(`/projects/all/liquidity-types/${liquidityTypeId}`, liquidityType, undefined, {
		409: () => `该收支类型已经存在`
	})
}

export function removeLiquidityType(liquidityTypeId) {
	return remove(`/projects/all/liquidity-types/${liquidityTypeId}`)
}

export function addFinancialSource(financialSource) {
	return post('/financial-sources', financialSource, undefined, {
		409: () => `已存在名为“${financialSource.name}”的资金渠道`
	})
}

export function updateFinancialSource(financialSourceId, financialSource) {
	return put(`/financial-sources/${financialSourceId}`, financialSource, undefined, {
		409: () => `已存在或曾经存在名为“${financialSource.name}”的资金渠道`
	})
}

export function queryFinancialSource(query) {
	return get('/financial-sources', query)
}

export function removeFinancialSource(financialSourceId) {
	return remove(`/financial-sources/${financialSourceId}`)
}

export function queryDocuments(query) {
	return get(`/documents`, query).then(({ count, rows }) => {
		rows.forEach(row => {
			row.amount = row.amount / 100
		})
		return { count, rows }
	})
}

export function addDocument(document) {
	return post('/documents', document)
}

export function updateDocument(documentId, document) {
	return put(`/documents/${documentId}`, document)
}

export function removeDocument(documentId) {
	return remove(`/documents/${documentId}`)
}

export function addOrUpdateFinancialSourceTracker(financialSourceId, financialSourceTracker) {
	return post(`/financial-sources/${financialSourceId}/trackers`, financialSourceTracker)
}

export function queryFinancialSourceTracker(query) {
	return get(`/financial-monthly-summary`, query)
}

export function removeFinancialSourceTracker(financialSourceId) {
	return remove(`/financial-sources/${financialSourceId}`)
}

export function getFinancialSourceTrackerAnnualCounter(query) {
	return get(`/financial-sources/all/trackers/annual-counter`, query)
}


export function queryFinancialFlow(query) {
	return get(`/financial-sources/all/flows`, query).then(({ count, rows }) => {
		rows.forEach(row => {
			row.incomeAmount = row.incomeAmount / 100
			row.expenseAmount = row.expenseAmount / 100
			row.balance = row.balance / 100
		})
		return { count, rows }
	})
}

export function addFinancialFlow(financialSourceId, financialFlow) {
	return post(`/financial-sources/${financialSourceId}/flows`, financialFlow)
}

export function updateFinancialFlow(financialFlowId, financialFlow) {
	return put(`/financial-sources/all/flows/${financialFlowId}`, financialFlow)
}

export function removeFinancialFlow(financialFlowId) {
	return remove(`/financial-sources/all/flows/${financialFlowId}`)
}