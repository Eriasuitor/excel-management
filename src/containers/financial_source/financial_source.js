import React from 'react';
import { Table, Modal, Button, Empty, message, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './financial_source.css'
import { withRouter } from 'react-router'
import FinancialSourceEditor from '../../components/financial_source_editor/financial_source_editor';
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
			title: '初始金额',
			dataIndex: 'initialStock',
			key: 'initialStock',
			render: v => `¥ ${v / 100}`,
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
			render: (financialSource) => (
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
						title="编辑此资金渠道"
						onClick={this.showFinancialSourceEditor.bind(this, {
							id: financialSource.id,
							name: financialSource.name,
							desc: financialSource.desc,
							initialStock: financialSource.initialStock / 100
						})}
					></Button>
					<Popconfirm
						onClick={e => e.stopPropagation()}
						onCancel={e => e.stopPropagation()}
						title={`你确定要删除资金渠道“${financialSource.name}”吗？`}
						icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
						onConfirm={this.removeFinancialSource.bind(this, financialSource.id)}
					>
						<Button title="删除此资金渠道" className="App-small-font" type="primary" shape='circle' icon={<DeleteOutlined />} size="small"></Button>
					</Popconfirm>

				</span>
			),
		},
	];

	state = {
		showFinancialSourceEditor: false,
		saving: false,
		financialSources: [],
		loading: false,
		editingFinancialSource: {},
		counter: 1,
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		}
	}

	async componentDidMount() {
		this.queryFinancialSource()
	}

	async queryFinancialSource(page = 1) {
		try {
			this.setState({
				loading: true
			})
			const { pageSize } = this.state.pagination
			const { count, rows } = await Request.queryFinancialSource({
				page, pageSize
			})
			this.state.pagination.total = count
			this.setState({
				financialSources: rows,
				pagination: this.state.pagination
			})
		} catch (error) {

		} finally {
			this.setState({
				loading: false
			})
		}
	}

	handleTableChange = (pagination, filters, sorter) => {
		console.log({ pagination, filters, sorter })
		this.setState({
			pagination
		})
		this.queryFinancialSource(pagination.current)
	};

	handleOk = e => {
		console.log(this.state)
		this.state.formRef.current.submit()
	};

	async handleFinish(financialSource) {
		try {
			this.setState({
				saving: true
			})
			financialSource.initialStock && (financialSource.initialStock = Math.round(financialSource.initialStock * 100))
			if (this.state.editingFinancialSource.id) {
				await Request.updateFinancialSource(this.state.editingFinancialSource.id, financialSource)
			} else {
				await Request.addFinancialSource(financialSource)
			}
			this.queryFinancialSource()
			this.setState({
				showFinancialSourceEditor: false
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
			showFinancialSourceEditor: false
		});
	};

	async removeFinancialSource(financialSourceId, e) {
		e.stopPropagation()
		try {
			await Request.removeFinancialSource(financialSourceId)
			this.setState({
				financialSources: this.state.financialSources.filter(_ => _.id !== financialSourceId)
			})
			message.success('删除成功')
		} catch (error) {
		} finally {

		}
	}


	showFinancialSourceEditor(financialSource, e) {
		console.log(financialSource)
		e && e.stopPropagation()
		this.setState({
			formRef: React.createRef(),
			showFinancialSourceEditor: true,
			editingFinancialSource: financialSource,
			counter: this.state.counter + 1
		})
	}

	render() {
		return (
			<div>
				<div className="App-layout-header">
					<div className="App-layout-title">资金渠道列表</div>
					<Button
						type="primary"
						shape="round"
						onClick={this.showFinancialSourceEditor.bind(this)}
						icon={<PlusOutlined />}
					>新增资金渠道</Button>
				</div>
				<Modal
					visible={this.state.showFinancialSourceEditor}
					title={`${this.state.editingFinancialSource.id && '编辑' || '新增'}资金渠道`}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						<Button key="back" onClick={this.handleCancel}>取消</Button>,
						<Button key="submit" type="primary" loading={this.state.saving} onClick={this.handleOk}>保存</Button>,
					]}
				>
					<FinancialSourceEditor formRef={this.state.formRef} onFinish={this.handleFinish.bind(this)} financialSource={this.state.editingFinancialSource} key={this.state.counter} />
				</Modal>
				<Table
					className="App-main-table App-no-selector"
					columns={this.columns}
					dataSource={this.state.financialSources}
					scroll={{ y: 'calc(100vh - 320px)' }}
					rowKey={record => record.id}
					loading={this.state.loading}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
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
								onClick={this.showFinancialSourceEditor.bind(this)}
								icon={<PlusOutlined />}
							>添加资金渠道</Button>
						</Empty>
					}}
				/>
			</div>
		)
	}
}

export default withRouter(Container)