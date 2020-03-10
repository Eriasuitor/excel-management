const xlsx2 = require('excel4node')
const valueCashHandler = require('./analyser/valueCash')

module.exports = {
	/**
	 * file maybe deficient
	 * @param {{deposit: string}[]} excelPathList 
	 */
	fillSheet: function(workSheet, excelPathsList) {
		excelPathsList.forEach((paths, index) => {
			const {valueCash: valueCashPath} = paths
			if(!valueCashPath) return
			const col = index + 4
			const valueCashData = valueCashHandler.resolve(valueCashPath)
			workSheet.data[12][col] = valueCashData.data.find(_ => _.abstract = '上月结转').amount
			workSheet.data[13][col] = valueCashData.total.in
			workSheet.data[14][col] = workSheet.data[12][col] + workSheet.data[13][col]
			workSheet.data[15][col] = workSheet.data[11][col] + workSheet.data[14][col]
			workSheet.data[20][col] = valueCashData.total.out
			workSheet.data[21][col] = workSheet.data[20][col] + workSheet.data[19][col]
			workSheet.data[22][col] = workSheet.data[4][col] - workSheet.data[16][col]
			workSheet.data[23][col] = workSheet.data[7][col] - workSheet.data[17][col]
			workSheet.data[24][col] = workSheet.data[10][col] - workSheet.data[18][col]
			workSheet.data[25][col] = workSheet.data[22][col] + workSheet.data[23][col] + workSheet.data[24][col]
			workSheet.data[26][col] = workSheet.data[14][col] - workSheet.data[20][col]
			workSheet.data[27][col] = workSheet.data[25][col] + workSheet.data[26][col]
		})
		return workSheet
	},
}