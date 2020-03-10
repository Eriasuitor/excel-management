const xlsx2 = require('excel4node')
const depositHandler = require('./analyser/deposit')

module.exports = {
	/**
	 * file maybe deficient
	 * @param {{deposit: string}[]} excelPathList 
	 */
	generateSheet: function(excelPathsList) {
		const workSheet = {
			name: '资金表',
			rows: 28,
			cols: 16,
			data: [
				['收支情况\\月份',,,, '月份'],
				[,,,,'1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				['收\n入', '账户', '643', '上月结转', 'fill here'],
				[,,, '当月收入', 'fill here'],
				[,,, '小计', 'fill here'],
				[,, '777', '上月结转', 'fill here'],
				[,,, '当月收入', 'fill here'],
				[,,, '小计', 'fill here'],
				[,, '58', '上月结转', 'fill here'],
				[,,, '当月收入', 'fill here'],
				[,,, '小计', 'fill here'],
				[,,'合计',, 'fill here'],
				[,'现金','上月结转',, 'fill here'],
				[,,'当月收入', ,'fill here'],
				[,,'小计',, 'fill here'],
				[,'总计',, '上月结转', 'fill here'],
				['支出', '账户', '643',,'fill here'],
				[,, '777',,'fill here'],
				[,, '58',,'fill here'],
				[,, '合计',,'fill here'],
				[,'现金',,,'fill here'],
				[,'总计',,,'fill here'],
				['余额', '账户', '643',,'fill here'],
				[,, '777',,'fill here'],
				[,, '58',,'fill here'],
				[,, '合计',,'fill here'],
				[,'现金',,,'fill here'],
				[,'总计',,,'fill here'],
				[,,,'复核人：',,,,'统计人：',,,,,'统计时间：']
			],
			options: {
				'!merges': [{
					s: {c: 0, r: 0},
					e: {c: 3, r: 1}
				}, {
					s: {c: 0, r: 2},
					e: {c: 0, r: 15}
				}, {
					s: {c: 0, r: 16},
					e: {c: 0, r: 21}
				}, {
					s: {c: 0, r: 22},
					e: {c: 0, r: 27}
				}, {
					s: {c: 1, r: 2},
					e: {c: 1, r: 11}
				}, {
					s: {c: 1, r: 12},
					e: {c: 1, r: 14}
				}, {
					s: {c: 1, r: 15},
					e: {c: 3, r: 15}
				}, {
					s: {c: 1, r: 16},
					e: {c: 1, r: 19}
				}, {
					s: {c: 1, r: 20},
					e: {c: 3, r: 20}
				}, {
					s: {c: 1, r: 21},
					e: {c: 3, r: 21}
				}, {
					s: {c: 1, r: 22},
					e: {c: 1, r: 25}
				}, {
					s: {c: 1, r: 26},
					e: {c: 3, r: 26}
				}, {
					s: {c: 1, r: 27},
					e: {c: 3, r: 27}
				}, {
					s: {c: 2, r: 2},
					e: {c: 2, r: 4}
				}, {
					s: {c: 2, r: 5},
					e: {c: 2, r: 7}
				}, {
					s: {c: 2, r: 8},
					e: {c: 2, r: 10}
				}, {
					s: {c: 2, r: 11},
					e: {c: 3, r: 11}
				}, {
					s: {c: 2, r: 12},
					e: {c: 3, r: 12}
				}, {
					s: {c: 2, r: 13},
					e: {c: 3, r: 13}
				}, {
					s: {c: 2, r: 14},
					e: {c: 3, r: 14}
				}, {
					s: {c: 2, r: 16},
					e: {c: 3, r: 16}
				}, {
					s: {c: 2, r: 17},
					e: {c: 3, r: 17}
				}, {
					s: {c: 2, r: 18},
					e: {c: 3, r: 18}
				}, {
					s: {c: 2, r: 19},
					e: {c: 3, r: 19}
				}, {
					s: {c: 2, r: 22},
					e: {c: 3, r: 22}
				}, {
					s: {c: 2, r: 23},
					e: {c: 3, r: 23}
				}, {
					s: {c: 2, r: 24},
					e: {c: 3, r: 24}
				}, {
					s: {c: 2, r: 25},
					e: {c: 3, r: 25}
				},{
					s: {c: 4, r: 0},
					e: {c: 15, r: 0}
				}],
				'!cols': [{
					wpx: 4
				}, {
					wpx: 4
				}, {
					wpx: 4
				}]
			}
		}
		excelPathsList.forEach((paths, index) => {
			const {deposit: depositPath} = paths
			if(!depositPath) return
			const col = index + 4
			const depositData = depositHandler.resolve(depositPath)
			workSheet.data[2][col] = depositData[643].lastMonthBalance
			workSheet.data[3][col] = depositData[643].in
			workSheet.data[4][col] = depositData[643].lastMonthBalance + depositData[643].in
			workSheet.data[5][col] = depositData[777].lastMonthBalance
			workSheet.data[6][col] = depositData[777].in
			workSheet.data[7][col] = depositData[777].lastMonthBalance + depositData[777].in
			workSheet.data[8][col] = depositData[58].lastMonthBalance
			workSheet.data[9][col] = depositData[58].in
			workSheet.data[10][col] = depositData[58].lastMonthBalance + depositData[58].in
			workSheet.data[11][col] = workSheet.data[4][col] + workSheet.data[7][col] + workSheet.data[10][col]
			workSheet.data[16][col] = depositData[643].out
			workSheet.data[17][col] = depositData[777].out
			workSheet.data[18][col] = depositData[58].out
			workSheet.data[19][col] = workSheet.data[16][col] + workSheet.data[17][col] + workSheet.data[18][col]
		})
		return workSheet
	},
}