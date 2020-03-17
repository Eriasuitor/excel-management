import React from 'react';
import { Table, Modal, Button, Empty, message, Popconfirm, DatePicker, Select, Form, InputNumber, Input } from 'antd';
import './financial_flow.css'
import empty from '../../empty.svg';
import { withRouter } from 'react-router'
import * as Request from '../../network/request'
import Editor from '../../components/editor/editor';
import * as Translator from '../../util/translator'
import * as moment from 'moment'
import { PlusOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';

class Container extends React.Component {
	columns = [
		{
			title: '资金渠道',
			dataIndex: 'financialSource',
			render: t => t.name
		},
		{
			title: '流水号',
			dataIndex: 'humanReadableId',
			key: 'humanReadableId'
		},
		{
			title: '摘要',
			dataIndex: 'abstract',
			key: 'abstract'
		},
		{
			title: '收入',
			dataIndex: 'incomeAmount',
		},
		{
			title: '支出',
			dataIndex: 'expenseAmount',
		},
		{
			title: '余额',
			dataIndex: 'balance',
		},
		{
			title: '发生时间',
			dataIndex: 'generatedAt',
			key: 'generatedAt',
			render: generatedAt => moment(generatedAt).format('YYYY/MM/DD')
		},
		{
			title: '备注',
			dataIndex: 'remark',
			key: 'remark'
		},
		{
			title: '操作',
			key: 'operation',
			render: (financialFlow) => (
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
						title="编辑此流水"
						onClick={this.showFinancialFlowEditor.bind(this, {
							id: financialFlow.id,
							financialSourceId: financialFlow.financialSourceId,
							abstract: financialFlow.abstract,
							humanReadableId: financialFlow.humanReadableId,
							incomeAmount: financialFlow.incomeAmount,
							expenseAmount: financialFlow.expenseAmount,
							balance: financialFlow.balance,
							generatedAt: moment(financialFlow.generatedAt),
							remark: financialFlow.remark,
						})}
					></Button>
					<Popconfirm
						onClick={e => e.stopPropagation()}
						onCancel={e => e.stopPropagation()}
						title={`你确定要删除此流水吗？`}
						icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
						onConfirm={this.removeFinancialFlow.bind(this, financialFlow.id)}
					>
						<Button
							title="删除此流水"
							className="App-small-font"
							type="primary"
							shape='circle'
							style={{
								marginRight: '4px'
							}}
							icon={<DeleteOutlined />}
							size="small"
						></Button>
					</Popconfirm>
				</span>
			),
		},
	];

	state = {
		showFinancialFlowEditor: false,
		saving: false,
		loading: false,
		financialFlows: [],
		financialSources: [],
		editingFinancialFlow: {},
		counter: 1,
		pagination: {
			current: 1,
			pageSize: 2,
			total: 100,
		}
	}

	async componentDidMount() {
		try {
			const { rows: financialSources } = await Request.queryFinancialSource({ pageSize: 100000000 })
			this.setState({ financialSources })
		} catch (error) {

		}
		this.queryFinancialFlow()
	}

	handleOk = e => {
		this.state.formRef.current.submit()
	};

	handleCancel = e => {
		this.setState({
			showFinancialFlowEditor: false
		});
	};

	showFinancialFlowEditor(financialFlow, e) {
		console.log(financialFlow)
		this.setState({
			formRef: React.createRef(),
			counter: this.state.counter + 1,
			editingFinancialFlow: financialFlow,
			showFinancialFlowEditor: true,
		})
	}

	async removeFinancialFlow(financialFlowId, e) {
		e.stopPropagation()
		try {
			await Request.removeFinancialFlow(financialFlowId)
			this.setState({
				financialFlows: this.state.financialFlows.filter(_ => _.id !== financialFlowId)
			})
			message.success('删除成功')
		} catch (error) {
		} finally {

		}
	}

	handleTableChange = (pagination, filters, sorter) => {
		console.log({ pagination, filters, sorter })
		this.setState({
			pagination
		})
		this.queryFinancialFlow({page: pagination.current})
	};

	async onFinish(financialFlow) {
		try {
			this.setState({
				saving: true
			})
			const {financialSourceId} = financialFlow
			delete financialFlow.financialSourceId
			financialFlow.incomeAmount = Math.round(financialFlow.incomeAmount * 100)
			financialFlow.expenseAmount = Math.round(financialFlow.expenseAmount * 100)
			financialFlow.balance = Math.round(financialFlow.balance * 100)
			if (this.state.editingFinancialFlow.id) {
				await Request.updateFinancialFlow(this.state.editingFinancialFlow.id, financialFlow)
			} else {
				await Request.addFinancialFlow(financialSourceId, financialFlow)
			}
			this.queryFinancialFlow()
			this.setState({
				showFinancialFlowEditor: false
			})
		} catch (error) {
			console.log(error)
		} finally {
			this.setState({
				saving: false
			})
		}
	}

	async queryFinancialFlow(query) {
		try {
			this.setState({
				loading: true
			})
			const { pageSize } = this.state.pagination
			const { rows, count } = await Request.queryFinancialFlow({ pageSize, ...query })
			this.state.pagination.total = count
			this.setState({
				financialFlows: rows,
				pagination: this.state.pagination
			})
		} catch (error) {

		} finally {
			this.setState({
				loading: false
			})
		}
	}

	changeDate(date) {
		this.queryFinancialFlow({page: 1, ...(date? {generatedAtFrom: date.format('YYYY-MM'), generatedAtTo: moment(date).add(1, 'month').format('YYYY-MM')}: {}) })
	}

	render() {
		return (
			<div>
				<div className="App-layout-header">
					<div>
						<span className="App-layout-title" style={{
							marginRight: '12px'
						}}>流水列表</span>
						<DatePicker bordered={false} placeholder="点击选择月份" onChange={this.changeDate.bind(this)} picker="month" />
					</div>
					<Button
						type="primary"
						shape="round"
						onClick={this.showFinancialFlowEditor.bind(this)}
						icon={<PlusOutlined />}
					>添加流水</Button>
				</div>
				<Modal
					visible={this.state.showFinancialFlowEditor}
					title={`${this.state.editingFinancialFlow.id && '编辑' || '添加'}流水`}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						<Button key="back" onClick={this.handleCancel}>取消</Button>,
						<Button key="submit" type="primary" loading={this.state.saving} onClick={this.handleOk}>保存</Button>,
					]}
				>
					<Editor 
					key={this.state.counter} 
					formRef={this.state.formRef} 
					data={this.state.editingFinancialFlow} 
					onFinish={this.onFinish.bind(this)} 
					rows={[
						{
							name: 'financialSourceId', label: '资金渠道', requiredMsg: '请输入资金渠道', rules: [], input:
								<Select
								disabled={this.state.editingFinancialFlow.financialSourceId}
									placeholder="请选择资金渠道"
								>
									{this.state.financialSources.map(fs => <Select.Option key={fs.id} value={fs.id}>{fs.name}</Select.Option>)}
								</Select>
						},
						{ name: 'humanReadableId', label: '凭证号', required: true, rules: [{
							max: 64, message: '凭证号最长为64个字符'
						}], input: <Input placeholder="请输入凭证号" /> },
						{
							name: 'abstract', label: '摘要', required: true, rules: [{
								max: 128, message: '摘要最长为128个字符'
							}], input: <Input.TextArea placeholder='请输入摘要' autoSize />
						},
						{
							name: 'incomeAmount', label: '收入', required: true, rules: [], input: <div>
								<Form.Item
									name="incomeAmount"
									noStyle
								>
									<InputNumber placeholder="请输入收入金额" style={{ width: '50%' }} min={0} step={0.01} precision={2}></InputNumber>
								</Form.Item>
								<span className="ant-form-text">元</span>
							</div>
						},
						{
							name: 'expenseAmount', label: '支出', required: true, rules: [], input: <div>
								<Form.Item
									name="expenseAmount"
									noStyle
								>
									<InputNumber placeholder="请输入支出金额" style={{ width: '50%' }} min={0} step={0.01} precision={2}></InputNumber>
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
									<InputNumber placeholder="请输入余额" style={{ width: '50%' }} min={0} step={0.01} precision={2}></InputNumber>
								</Form.Item>
								<span className="ant-form-text">元</span>
							</div>
						},{
							name: 'generatedAt', label: '发生时间', required: true, input: <DatePicker placeholder="请选择发生时间"></DatePicker>
						}, {
							name: 'remark', label: '备注', rules: [{
								max: 256, message: '备注最长为256个字符'
							}], input:  <Input.TextArea placeholder='请输入摘要' autoSize />
							
						}
					]}
					/>
				</Modal>

				<Table
					className="App-main-table"
					columns={this.columns}
					dataSource={this.state.financialFlows}
					scroll={{ y: 'calc(100vh - 320px)' }}
					rowKey={record => record.id}
					loading={this.state.loading}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
					size='small'
					locale={{
						emptyText: () => <Empty
							image={empty}
							imageStyle={{
								height: 60,
							}}
							description={
								<span>暂无数据</span>
							}
						>
							<Button
								type="primary"
								shape="round"
								onClick={this.showFinancialFlowEditor.bind(this)}
								icon={<PlusOutlined />}
							>添加流水</Button>
						</Empty>
					}}
				/>
			</div>
		)
	}
}

export default withRouter(Container)