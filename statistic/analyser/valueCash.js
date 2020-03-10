const xlsx = require('node-xlsx');

module.exports = {
	resolve: function (path) {
		const [{ data }] = xlsx.parse(path)
		const signRow = data.findIndex(_ => _[0] && _[0].trim && _[0].trim().startsWith('复核人'))
		return {
			year: data[0][0].match(/(\d*?)年/)[1],
			month: data[0][0].match(/(\d*?)月/)[1],
			reviewer: data[signRow][0],
			scheduler: data[signRow][2],
			scheduledAt: data[signRow][5],
			total: {
				in: data[signRow - 2][2],
				out: data[signRow - 2][3],
				amount: data[signRow - 2][4],
				certificateId: data[signRow - 2][5],
				remark: data[signRow - 2][6],
			},
			data: data.slice(3, signRow - 2).map(_ => ({
				id: _[0],
				abstract: _[1],
				in: _[2],
				out: _[3],
				amount: _[4],
				certificateId: _[5],
				remark: _[6]
			}))
		}
	}
}
