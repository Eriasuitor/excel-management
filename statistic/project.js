const xlsx2 = require('excel4node')
const certificateHandler = require('./analyser/certificate')

module.exports = {
	/**
	 * file maybe deficient
	 * @param {{deposit: string}[]} excelPathList 
	 */
	generateSheet: function(excelPathsList, {year, foundSheet}) {
		const workSheet = {
			name: '项目表',
			rows: 18,
			rowStart: 3,
			cols: 7,
			data: [
				[`${year}年度收支情况统计表（项目管理）`],
				[],
				['序号', '发生时间',,,,,'备注'],
				[,'月','日','收入合计','支出合计', '收支结余'],
				['1'],
				['2'],
				['3'],
				['4'],
				['5'],
				['6'],
				['7'],
				['8'],
				['9'],
				['10'],
				['11'],
				['12'],
				['本年合计'],
				['上年结转'],
				['现金库存收入'],
				['当前结余']
			],
			options: {
				'!merges': [{
					s: {c: 0, r: 0},
					e: {c: 6, r: 0}
				}, {
					s: {c: 0, r: 2},
					e: {c: 0, r: 3}
				}, {
					s: {c: 0, r: 16},
					e: {c: 2, r: 16}
				}, {
					s: {c: 0, r: 17},
					e: {c: 2, r: 17}
				}, {
					s: {c: 0, r: 18},
					e: {c: 2, r: 18}
				}, {
					s: {c: 0, r: 19},
					e: {c: 2, r: 19}
				}, {
					s: {c: 1, r: 2},
					e: {c: 2, r: 2}
				}, {
					s: {c: 3, r: 2},
					e: {c: 5, r: 2}
				}, {
					s: {c: 6, r: 2},
					e: {c: 6, r: 3}
				}, {
					s: {c: 3, r: 17},
					e: {c: 5, r: 17}
				}, {
					s: {c: 3, r: 18},
					e: {c: 5, r: 18}
				}, {
					s: {c: 3, r: 19},
					e: {c: 5, r: 19}
				}],
				'!cols': [{
					wpx: 5
				}, {
					wpx: 5
				}, {
					wpx: 5
				}, {
					wpx: 12
				}, {
					wpx: 12
				}, {
					wpx: 12
				}, {
					wpx: 12
				}]
			}
		}
		excelPathsList.forEach((paths, index) => {
			const {certificate: certificatePath} = paths
			if(!certificatePath) return
			const row = index + 4
			const {certificate: certificateDate} = certificateHandler.resolve(certificatePath)
			workSheet.data[row][3] = certificateDate.total.in
			workSheet.data[row][4] = certificateDate.total.out
			workSheet.data[row][5] = workSheet.data[row][4] - workSheet.data[row][3]
		})
		workSheet.data[16][3] = 0
		workSheet.data[16][4] = 0
		workSheet.data[16][5] = 0
		workSheet.data[18][3] = 0
		for(let i = 4; i < 16; i++) {
			workSheet.data[16][3] += workSheet.data[i][3] || 0
			workSheet.data[16][4] += workSheet.data[i][4] || 0
			workSheet.data[16][5] += workSheet.data[i][5] || 0

			workSheet.data[18][3] += foundSheet.data[13][i] || 0
		}
		workSheet.data[17][3] = foundSheet.data[2][4] + foundSheet.data[5][4] + foundSheet.data[8][4] + foundSheet.data[12][4]
		workSheet.data[19][3] = workSheet.data[16][5] + workSheet.data[17][3] + workSheet.data[18][3]
		return workSheet
	},
}