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
		const project = require('./project').generateSheet(pathsList, {year, foundSheet: found})
		const examBig = require('./examBig').generateSheet(pathsList, {year})
		const exam = require('./exam').generateSheet(pathsList, {year, examBigSheet: examBig})
		const integratedProject = require('./integratedProject').generateSheet(pathsList, {year})
		const finance = require('./finance').generateSheet(pathsList, {year})
		const sells = require('./sells').generateSheet(pathsList, {year})
		const lastYearCarryOver = require('./lastYearCarryOver').generateSheet(pathsList, {year})
		const examFee = require('./examFee').generateSheet(pathsList, {year})
		const otherProject = require('./otherProject').generateSheet(pathsList, {year})
		const workSheets = [
			found, project, exam, examBig, integratedProject, finance, sells,lastYearCarryOver, examFee,otherProject
		]
		const workBook =  excelTool.generateWorkBook(workSheets)
		excelTool.saveWorkBook('result.xlsx', workBook)
	}
}