const xlsx2 = require('excel4node')
const certificateHandler = require('./analyser/certificate')

module.exports = {
	/**
	 * file maybe deficient
	 * @param {{deposit: string}[]} excelPathList 
	 */
	generateSheet: function(excelPathsList, {year, examBigSheet}) {
		const workSheet = {
			name: '综合项目',
			rows: 16,
			rowStart: 3,
			cols: 8,
			data: [
				[`${year}年度收支情况统计表（项目管理）`],
				[],
				['序号', '发生时间',, '综合项目'],
				[,'月', '日', '收入', ,'支出', ,'结余'],
				[,,,'金额','摘要','金额', '摘要'],
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
				['合计'],
			],
			options: {
				'!merges': [{
					s: {c: 0, r: 0},
					e: {c: 7, r: 0}
				}, {
					s: {c: 0, r: 2},
					e: {c: 0, r: 4}
				}, {
					s: {c: 1, r: 2},
					e: {c: 2, r: 2}
				}, {
					s: {c: 3, r: 2},
					e: {c: 7, r: 2}
				}, {
					s: {c: 3, r: 3},
					e: {c: 4, r: 3}
				}, {
					s: {c: 5, r: 3},
					e: {c: 6, r: 3}
				}, {
					s: {c: 7, r: 3},
					e: {c: 7, r: 4}
				}, {
					s: {c: 0, r: 17},
					e: {c: 2, r: 17}
				}, {
					s: {c: 1, r: 3},
					e: {c: 1, r: 4}
				}, {
					s: {c: 2, r: 3},
					e: {c: 2, r: 4}
				}],
				'!cols': [{
					wpx: 5
				}, {
					wpx: 6
				}, {
					wpx: 6
				}, {
					wpx: 12
				}, {
					wpx: 12
				}]
			}
		}
		return workSheet
	},
}