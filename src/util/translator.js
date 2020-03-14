const envMapper = {
	local: '本地环境',
	development: '开发环境',
	production: '正式环境',
	test: '测试环境',
	audit: '审核环境'
}

export function env2HumanReadable(env) {
	return envMapper[env] || '环境错误'
}