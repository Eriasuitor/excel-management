const path = require('path')
const fs = require('fs')
const excelTool = require('./excel-tool')

module.exports = {
	generateAnnualReport: function(year) {
		const yearFilePath = path.join(__dirname, `data/${year}`)
		const pathsList = Array(12).fill({})
		pathsList.forEach((_,index) => {
			const monthFilePath = path.join(yearFilePath, String(index + 1))
			const files = fs.existsSync(monthFilePath)? fs.readdirSync(monthFilePath): []
			pathsList[index] = files.reduce((result, file) => {
				result[file.split('.').slice(0, -1).join('.')] = path.join(monthFilePath, file)
				return result
			}, {})
		})
		const found = require('./found').generateSheet(pathsList)
		require('./valueCash').fillSheet(found, pathsList)
		const project = require('./certificate').generateSheet(pathsList, {year})
		const examBig = require('./examBig').generateSheet(pathsList, {year})
		const workSheets = [
			found, project, examBig
		]
		const workBook =  excelTool.generateWorkBook(workSheets)
		excelTool.saveWorkBook('result.xlsx', workBook)
	}
}