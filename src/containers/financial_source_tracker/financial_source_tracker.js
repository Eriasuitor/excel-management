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
	columns = [
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: '描述',
			dataIndex: 'desc',
			render: desc => desc || '无',
			key: 'desc'
		},
		{
			title: '创建时间',
			dataIndex: 'createdAt',
			render: d => moment(d).format('YYYY年MM月DD日'),
			key: 'desc'
		},
		{
			title: '操作',
			key: 'operation',
			render: (row) => (
				<span className="table-operation">
					<Button
						className="App-small-font"
						type="primary"
						shape="circle"
						style={{
							marginRight: '4px'
						}}
						icon={<EditOutlined />}
						size="small"
						title="编辑此存款变动"
						onClick={this.showEditor.bind(this, {
							id: row.id,
							name: row.name,
							desc: row.desc
						})}
					></Button>
					<Popconfirm
						onClick={e => e.stopPropagation()}
						onCancel={e => e.stopPropagation()}
						title={`你确定要删除存款变动“${row.name}”吗？`}
						icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
						onConfirm={this.removeFinancialSourceTracker.bind(this, row.id)}
					>
						<Button title="删除此存款变动" className="App-small-font" type="primary" shape='circle' icon={<DeleteOutlined />} size="small"></Button>
					</Popconfirm>

				</span>
			),
		},
	];

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
		pagination: {
			current: 1,
			pageSize: 2,
			total: 100,
		}
	}

	async componentDidMount() {
		this.queryFinancialSourceTracker(this.state.date.get('year'), this.state.date.get('month') + 1)
		this.queryFinancialSourceTrackerAnnualCounter()
		try {
			const { rows: financialSources } = await Request.queryFinancialSource({ pageSize: 100000000 })
			this.setState({ financialSources })
		} catch (error) {

		}
	}

	async queryFinancialSourceTracker(year = this.state.date.get('year'), month = this.state.date.get('month') + 1) {
		try {
			this.setState({
				loadingTracker: true
			})
			const { count, rows } = await Request.queryFinancialSourceTracker({
				pageSize: 1000000, year, month
			})
			this.state.pagination.total = count
			this.setState({
				rows: rows,
				pagination: this.state.pagination
			})
		} catch (error) {

		} finally {
			this.setState({
				loadingTracker: false
			})
		}
	}

	handleTableChange = (pagination, filters, sorter) => {
		console.log({ pagination, filters, sorter })
		this.setState({
			pagination
		})
		this.queryFinancialSourceTracker(pagination.current)
	};

	handleOk = e => {
		this.state.formRef.current.submit()
	};

	async handleFinish(row) {
		try {
			console.log(row)
			this.setState({
				saving: true
			})
			const { financialSourceId, date, monthlyCarryoverAmount, income, expense, balance } = row
			delete row.financialSourceId
			delete row.date
			await Request.addOrUpdateFinancialSourceTracker(financialSourceId, {
				year: date.get('year'),
				month: date.get('month') + 1,
				monthlyCarryoverAmount: Math.round(monthlyCarryoverAmount * 100),
				income: Math.round(income * 100),
				expense: Math.round(expense * 100),
				balance: Math.round(balance * 100)
			})
			this.queryFinancialSourceTracker()
			this.setState({
				showEditor: false
			})
		} catch (error) {
			console.log(error)
		} finally {
			this.setState({
				saving: false
			})
		}
	}

	handleCancel = e => {
		this.setState({
			showEditor: false
		});
	};

	async removeFinancialSourceTracker(rowId, e) {
		e.stopPropagation()
		try {
			await Request.removeFinancialSourceTracker(rowId)
			this.setState({
				rows: this.state.rows.filter(_ => _.id !== rowId)
			})
			message.success('删除成功')
		} catch (error) {
		} finally {

		}
	}

	async queryFinancialSourceTrackerAnnualCounter(year = this.state.date.get('year')) {
		try {
			this.setState({
				loadingCounter: true
			})
			const counter = await Request.getFinancialSourceTrackerAnnualCounter({ year })
			this.setState({
				annualCounter: counter
			})
		} catch (error) {

		} finally {
			this.setState({
				loadingCounter: false
			})
		}
	}

	onPanelChange(date) {
		if (this.state.date.get('year') !== date.get('year')) {
			this.queryFinancialSourceTrackerAnnualCounter(date.get('year'))
		}
		this.setState({
			date
		})
		this.queryFinancialSourceTracker(date.get('year'), date.get('month') + 1)
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

	monthCellRender(date) {
		const month = date.get('month') + 1
		const { count } = this.state.annualCounter.find(_ => _.month === month) || { count: 0 }
		return <div style={{
			fontSize: '12px'
		}}>
			<Statistic title="资金渠道" value={count} suffix="个已录入" />
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
										}}>资金存款录入情况</span>
									</div>
									<DatePicker bordered={true} placeholder="点击选择年份" defaultValue={this.state.date} onChange={(date) => {
										date = date || moment()
										const now = value.clone().year(date.get('year'));
										onChange(now);
									}} picker="year" />
								</div>
							}}
							monthCellRender={this.monthCellRender.bind(this)}
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
							}}>{`${this.state.date.format('YYYY年MM月')}资金存款变动`}</span>
						</div>
					</div>
					<Spin spinning={this.state.loadingTracker}>
						<Collapse bordered={false} defaultActiveKey={[...Array(100).keys()]}>
							{this.state.financialSources.map((fs, index) => {
								const uploaded = this.state.rows.find(fst => fst.financialSourceId === fs.id) || {}
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
										<Button
											type="primary"
											shape="round"
											size="small"
											onClick={this.showEditor.bind(this, {
												financialSourceId: fs.id,
												date: this.state.date,
												...uploaded
											})}
											icon={uploaded.id ? <EditOutlined /> : <PlusOutlined />}
										>{`${uploaded.id ? '更改' : '录入'}`}</Button>
									</div>}
									key={index}
								>
									<div>
										{uploaded.id ? <Row gutter={[4, 24]}>
											<Col span={6}>
												<Statistic title="上月结转" value={uploaded.monthlyCarryoverAmount.toFixed(2)} suffix="元" />
											</Col>
											<Col span={6}>
												<Statistic title="收入" value={uploaded.income.toFixed(2)} suffix="元" />
											</Col>
											<Col span={6}>
												<Statistic title="支出" value={uploaded.expense.toFixed(2)} suffix="元" />
											</Col>
											<Col span={6}>
												<Statistic title="余额" value={uploaded.balance.toFixed(2)} suffix="元" />
											</Col>
										</Row> : <Empty
											image={empty}
											imageStyle={{
												height: 56,
											}}
											description={
												<span style={{
													fontSize: '12px'
												}}>暂未录入</span>
											}
										>
											</Empty>}

									</div>
								</Collapse.Panel>
							}
							)}
						</Collapse>
					</Spin>
				</Col>

				<Modal
					visible={this.state.showEditor}
					title={`${this.state.editingFinancialSourceTracker.id && '编辑' || '新增'}存款变动`}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						<Button key="back" onClick={this.handleCancel}>取消</Button>,
						<Button key="submit" type="primary" loading={this.state.saving} onClick={this.handleOk}>保存</Button>,
					]}
				>
					<Editor
						formRef={this.state.formRef}
						onFinish={this.handleFinish.bind(this)}
						data={this.state.editingFinancialSourceTracker} rows={[
							{
								name: 'financialSourceId', label: '资金渠道', requiredMsg: '请输入资金渠道', rules: [], input:
									<Select
										placeholder="请选择资金渠道"
									>
										{this.state.financialSources.map(fs => <Select.Option key={fs.id} value={fs.id}>{fs.name}</Select.Option>)}
									</Select>
							},
							{ name: 'date', label: '年月', required: true, rules: [], input: <DatePicker picker="month" /> },
							{
								name: 'monthlyCarryoverAmount', label: '上月结转', required: true, rules: [], input: <div>
									<Form.Item
										name="monthlyCarryoverAmount"
										noStyle
									>
										<InputNumber style={{ width: '50%' }} min={0} step={0.01} precision={2}></InputNumber>
									</Form.Item>
									<span className="ant-form-text">元</span>
								</div>
							},
							{
								name: 'income', label: '收入', required: true, rules: [], input: <div>
									<Form.Item
										name="income"
										noStyle
									>
										<InputNumber style={{ width: '50%' }} min={0} step={0.01} precision={2}></InputNumber>
									</Form.Item>
									<span className="ant-form-text">元</span>
								</div>
							},
							{
								name: 'expense', label: '支出', required: true, rules: [], input: <div>
									<Form.Item
										name="expense"
										noStyle
									>
										<InputNumber style={{ width: '50%' }} min={0} step={0.01} precision={2}></InputNumber>
									</Form.Item>
									<span className="ant-form-text">元</span>
								</div>
							},
							{
								name: 'balance', label: '余额', required: true, rules: [], input: <div>
									<Form.Item
										name="balance"
										noStyle
									>
										<InputNumber style={{ width: '50%' }} min={0} step={0.01} precision={2}></InputNumber>
									</Form.Item>
									<span className="ant-form-text">元</span>
								</div>
							},
						]}
						key={this.state.counter} />
				</Modal>
			</Row>
		)
	}
}

export default withRouter(Container)