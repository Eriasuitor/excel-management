const xlsx = require('node-xlsx');

module.exports = {
	resolve: function (path) {
		const [{data}] = xlsx.parse(path)
		return {
			year: data[0][0].match(/(\d*?)年/)[1],
			month: data[0][0].match(/(\d*?)月/)[1],
			reviewer: data[8][1],
			scheduler: data[8][5],
			scheduledAt: data[9][5],
			777: {
				lastMonthBalance: data[2][2] + data[3][2],
				in: data[2][3] + data[3][3],
				balance: data[2][4] + data[3][4],
				out: data[2][5] + data[3][5]
			},
			643: {
				lastMonthBalance: data[4][2],
				in: data[4][3],
				balance: data[4][4],
				out: data[4][5]
			},
			58: {
				lastMonthBalance: data[5][2],
				in: data[5][3],
				balance: data[5][4],
				out: data[5][5]
			}
		}
	}
}
