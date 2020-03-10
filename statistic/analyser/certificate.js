const xlsx = require('node-xlsx');

module.exports = {
	resolve: function (path) {
		let [{ data: pzPz }, { data: staffFee }, { data: basicOut }, { data: otherOut }, { data: examIn }] = xlsx.parse(path)
		let pzPzDataEnd = pzPz.findIndex(_ => _[2] && _[2].startsWith && _[2].startsWith('复核人'))
		if (pzPzDataEnd === -1) {
			pzPzDataEnd = pzPz.length - 1
		}
		let otherOutEnd = otherOut.findIndex(_ => _[0] && _[0].trim && _[0].trim().startsWith('复核人'))
		if(otherOutEnd === -1) {
			otherOutEnd = otherOut.length - 1
		}
		let examInEnd = examIn.findIndex(_ => _[0] && _[0].trim && _[0].trim().startsWith('复核人'))
		if(examInEnd === -1) {
			examInEnd = examIn.length - 1
		}
		return {
			certificate: {
				year: pzPz[0][0].match(/(\d*?)年/)[1],
				month: pzPz[0][0].match(/(\d*?)月/)[1],
				total: {
					in: pzPz[3][4],
					out: pzPz[3][5],
				},
				reviewer: pzPz[pzPzDataEnd][2],
				scheduler: pzPz[pzPzDataEnd][7],
				scheduledAt: pzPz[pzPzDataEnd + 1][7],
				list: pzPz.slice(4, pzPzDataEnd).map(_ => ({
					no: _[0],
					subNo: _[1],
					abstract: _[2],
					project: _[3],
					in: _[4],
					out: _[5],
					canal: _[6],
					handler: _[7],
					mark: _[8],
				}))
			},
			staffFee: {
				month: staffFee[0][0].match(/(\d*?)月/)[1],
				reviewer: staffFee[21][3],
				scheduler: staffFee[21][7],
				scheduledAt: staffFee[22][7],
				total: {
					fee: staffFee[20][6]
				}
			},
			basicOut: {
				month: basicOut[0][0].match(/(\d*?)月/)[1],
				total: {
					amount: basicOut[15][2],
					total: basicOut[15][3]
				}
			},
			otherOut: {
				month: otherOut[0][0].match(/(\d*?)月/)[1],
				total: {
					amount: otherOut[otherOutEnd - 1][4]
				}
			},
			examIn: {
				month: examIn[0][0].match(/(\d*?)月/)[1],
				total: {
					amount: examIn[examInEnd - 1][4]
				}
			}
		}
	}
}
