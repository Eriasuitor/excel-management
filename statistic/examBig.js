const xlsx2 = require('excel4node')
const certificateHandler = require('./analyser/certificate')

module.exports = {
	/**
	 * file maybe deficient
	 * @param {{deposit: string}[]} excelPathList 
	 */
	generateSheet: function(excelPathsList, {year}) {
		const workSheet = {
			name: '考试考务大表',
			rows: 16,
			rowStart: 1,
			cols: 15,
			data: [
				[`${year}年度考试考务经费项目收支统计表`],
				['发生月份', '收入',, '支出',,,,,,,,,, '结余', '备注'],
				[,'金额', '摘要', '人员经费', '基础支出', '考试考务支出',,,,,,,'合计'],
				[,,,,,'一、二级建筑师', '二级建筑师', '监理工程师', '一级建造师', '勘察设计工程师', '房地产估价师', '小计'],
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
					e: {c: 14, r: 0}
				}, {
					s: {c: 0, r: 1},
					e: {c: 0, r: 3}
				}, {
					s: {c: 1, r: 1},
					e: {c: 2, r: 1}
				}, {
					s: {c: 3, r: 1},
					e: {c: 12, r: 1}
				}, {
					s: {c: 1, r: 16},
					e: {c: 2, r: 16}
				}, {
					s: {c: 5, r: 2},
					e: {c: 11, r: 2}
				}, {
					s: {c: 1, r: 2},
					e: {c: 1, r: 3}
				}, {
					s: {c: 2, r: 2},
					e: {c: 2, r: 3}
				}, {
					s: {c: 3, r: 2},
					e: {c: 3, r: 3}
				}, {
					s: {c: 4, r: 2},
					e: {c: 4, r: 3}
				}, {
					s: {c: 13, r: 1},
					e: {c: 13, r: 3}
				}, {
					s: {c: 14, r: 1},
					e: {c: 14, r: 3}
				}, {
					s: {c: 12, r: 2},
					e: {c: 12, r: 3}
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