import config from '../config/index'
import { message } from 'antd'

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
	if(isJSON) {
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
		if( Array.isArray(query[key])) {
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