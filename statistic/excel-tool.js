const xlsx2 = require('excel4node')

module.exports = {
	/**
	 * 
	 * @param {{name: string, rows: number, cols: number, data: Object[], options: Object}[]} workSheets 
	 */
	generateWorkBook: function (workSheets) {
		const wb = new xlsx2.Workbook();
		const myStyle = wb.createStyle({
			alignment: {
				wrapText: true,
				horizontal: 'center',
				vertical: 'center'
			},
			font: {
				size: 12
			}
		})
		workSheets.forEach(sheetOpt => {
			const {name, rows = 1, cols = 1, rowStart = 1} = sheetOpt
			const ws = wb.addWorksheet(name);
			ws.cell(rowStart, 1, rows + rowStart - 1, cols).style(wb.createStyle({
				border: {
					left: {
						style: 'thin',
						color: "black"
					},
					right: {
						style: 'thin',
						color: "black"
					},
					top: {
						style: 'thin',
						color: "black"
					},
					bottom: {
						style: 'thin',
						color: "black"
					},
					diagonal: {
						style: 'thin',
						color: "black"
					}
				},
			}))
			sheetOpt.data && sheetOpt.data.forEach((r, ri) => {
				r.forEach((c, ci) => {
					!Number.isNaN(Number(c))? ws.cell(ri + 1, ci + 1).number(Number(c)).style(myStyle): ws.cell(ri + 1, ci + 1).string(c).style(myStyle)
				})
			})
			sheetOpt.options && sheetOpt.options["!merges"] && sheetOpt.options["!merges"].forEach(merge => {
				ws.cell(merge.s.r + 1, merge.s.c + 1, merge.e.r + 1, merge.e.c + 1, true)
			})
			sheetOpt.options && sheetOpt.options["!cols"] && sheetOpt.options["!cols"].forEach((col, index) => {
				col && ws.column(index + 1).setWidth(col.wpx)
			})
		})
		return wb
	},
	saveWorkBook: function(path, workBook) {
		workBook.write(path)
	}
}