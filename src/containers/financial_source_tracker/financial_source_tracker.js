import React from 'react';
import { Table, Modal, Button, Empty, message, Popconfirm, DatePicker, Calendar, Form, InputNumber, Select, Statistic, Row, Col, Collapse, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './financial_source_tracker.css'
import { withRouter } from 'react-router'
import Editor from '../../components/editor/editor';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as Request from '../../network/request'
import * as moment from 'moment'
import * as Translator from '../../util/translator'
import empty from '../../empty.svg';

class Container extends React.Component {

	state = {
		showEditor: false,
		saving: false,
		rows: [],
		date: moment(),
		editingFinancialSourceTracker: {},
		counter: 1,
		annualCounter: [],
		loadingTracker: false,
		loadingCounter: false,
		financialSources: [],
	}

	async componentDidMount() {
		this.queryFinancialSourceTracker(this.state.date.get('year'), this.state.date.get('month'))
		try {
			const { rows: financialSources } = await Request.queryFinancialSource({ pageSize: 100000000 })
			this.setState({ financialSources })
		} catch (error) {

		}
	}

	async queryFinancialSourceTracker(year = this.state.date.get('year'), month = this.state.date.get('month')) {
		try {
			this.setState({
				loadingTracker: true
			})
			const rows = await Request.queryFinancialSourceTracker({
				year, month
			})
			this.setState({
				rows: rows,
			})
		} catch (error) {

		} finally {
			this.setState({
				loadingTracker: false
			})
		}
	}

	onPanelChange(date) {
		this.setState({
			date
		})
		this.queryFinancialSourceTracker(date.get('year'), date.get('month'))
	}

	async showEditor(row, e) {
		e && e.stopPropagation()
		this.setState({
			formRef: React.createRef(),
			showEditor: true,
			editingFinancialSourceTracker: row,
			counter: this.state.counter + 1
		})
	}

	 monthIntervalTranslator = {
		0: '本月',
		1: '上月'
	}

	monthCellRender(date) {
		const monthInterval = moment().get('month') - date.get('month')
		return <div style={{
			fontSize: '24px',
		}}>
			{/* {this.monthIntervalTranslator[monthInterval] || ''} */}
		</div>

	}

	render() {
		return (
			<Row>
				<Col span={10} style={{
					paddingRight: '36px'
				}}>
					<Spin spinning={this.state.loadingCounter}>
						<Calendar
							onChange={this.onPanelChange.bind(this)}
							mode="year"
							headerRender={({ value, onChange }) => {
								return <div className="App-layout-header">
									<div>
										<span className="App-layout-title" style={{
											marginRight: '12px'
										}}>时间选择</span>
									</div>
									<DatePicker bordered={true} placeholder="点击选择年份" defaultValue={this.state.date} onChange={(date) => {
										date = date || moment()
										const now = value.clone().year(date.get('year'));
										onChange(now);
									}} picker="year" />
								</div>
							}}
							monthCellRender={this.monthCellRender.bind(this)}
							validRange={[moment(0), moment()]}
						/>
					</Spin>
				</Col>

				<Col span={14}>
					<div className="App-layout-header" style={{
						marginBottom: '12px'
					}}>
						<div>
							<span className="App-layout-title" style={{
								marginRight: '12px'
							}}>{`${this.state.date.format('YYYY年MM月')}资金渠道变动`}</span>
						</div>
					</div>
					<Spin spinning={this.state.loadingTracker}>
						<Collapse bordered={false} defaultActiveKey={[...Array(100).keys()]}>
							{this.state.financialSources.map((fs, index) => {
								const { monthlyStatistics } = this.state.rows.find(fst => fst.id === fs.id) || {

								}
								return <Collapse.Panel
									showArrow={false}
									header={<div style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between'
									}}>
										<div style={{
											fontSize: '18px',
										}}>{fs.name}</div>
									</div>}
									key={index}
								>
									<div>{
										monthlyStatistics ? <Row gutter={[4, 24]}>
											<Col span={6}>
												<Statistic title="上月结转" value={(monthlyStatistics.monthlyCarryoverAmount / 100).toFixed(2)} suffix="元" />
											</Col>
											<Col span={6}>
												<Statistic title="收入" value={(monthlyStatistics.income / 100).toFixed(2)} suffix="元" />
											</Col>
											<Col span={6}>
												<Statistic title="支出" value={(monthlyStatistics.expense / 100).toFixed(2)} suffix="元" />
											</Col>
											<Col span={6}>
												<Statistic title="余额" value={(monthlyStatistics.balance / 100).toFixed(2)} suffix="元" />
											</Col>
										</Row>
											: <div />
									}

									</div>
								</Collapse.Panel>
							}
							)}
						</Collapse>
					</Spin>
				</Col>
			</Row>
		)
	}
}

export default withRouter(Container)