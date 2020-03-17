import React from 'react';
import { Table, Modal, Button, Empty, message, Popconfirm, DatePicker } from 'antd';
import './document.css'
import empty from '../../empty.svg';
import { withRouter } from 'react-router'
import * as Request from '../../network/request'
import DocumentEditor from '../../components/document_editor/document_editor';
import * as Translator from '../../util/translator'
import * as moment from 'moment'
import { PlusOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';

class Container extends React.Component {
	columns = [
		{
			title: '项目',
			dataIndex: 'project',
			render: t => t.name
		},
		{
			title: '资金渠道',
			dataIndex: 'financialSource',
			render: t => t.name
		},
		{
			title: '凭证号',
			dataIndex: 'humanReadableId',
			key: 'humanReadableId'
		},
		{
			title: '摘要',
			dataIndex: 'abstract',
			key: 'abstract'
		},
		{
			title: '收支',
			dataIndex: 'liquidityType',
			render: liquidityType => Translator.parentType2HumanReadable(liquidityType.parentType)
		},
		{
			title: '收支类型',
			dataIndex: 'liquidityType',
			render: liquidityType => liquidityType.type
		},
		{
			title: '金额',
			dataIndex: 'amount',
			key: 'amount',
			render: amount => `¥ ${(amount / 100).toFixed(2)}`
		},
		{
			title: '发生时间',
			dataIndex: 'generatedAt',
			key: 'generatedAt',
			render: generatedAt => moment(generatedAt).format('YYYY/MM/DD')
		},
		{
			title: '经办人',
			dataIndex: 'handler',
			key: 'handler'
		},
		{
			title: '备注',
			dataIndex: 'remark',
			key: 'remark'
		},
		{
			title: '操作',
			key: 'operation',
			render: (document) => (
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
						title="编辑此凭证"
						onClick={this.showDocumentEditor.bind(this, {
							...document,
							projectId: document.project.id,
							financialSourceId: document.financialSource.id,
							liquidityTypeList: [document.liquidityType.parentType, document.liquidityType.id],
							amount: document.amount / 100,
							generatedAt: moment(document.generatedAt)
						})}
					></Button>
					<Popconfirm
						onClick={e => e.stopPropagation()}
						onCancel={e => e.stopPropagation()}
						title={`你确定要删除此凭证吗？`}
						icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
						onConfirm={this.removeDocument.bind(this, document.id)}
					>
						<Button
							title="删除此凭证"
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
		showDocumentEditor: false,
		saving: false,
		loading: false,
		documents: [],
		editingDocument: {},
		counter: 1,
		pagination: {
			current: 1,
			pageSize: 2,
			total: 100,
		}
	}

	handleOk = e => {
		this.state.formRef.current.submit()
	};

	handleCancel = e => {
		this.setState({
			showDocumentEditor: false
		});
	};

	showDocumentEditor(document, e) {
		console.log({ document, e })
		if (!e) {
			e = document
			document = {}
		}
		this.setState({
			formRef: React.createRef(),
			counter: this.state.count,
			editingDocument: document,
			showDocumentEditor: true,
		})
	}

	async removeDocument(documentId, e) {
		e.stopPropagation()
		try {
			await Request.removeDocument(documentId)
			this.setState({
				documents: this.state.documents.filter(_ => _.id !== documentId)
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
		this.queryDocuments({page: pagination.current})
	};

	async onFinish(document) {
		try {
			this.setState({
				saving: true
			})
			document.liquidityTypeId = document.liquidityTypeList[1]
			document.amount *= 100
			delete document.liquidityTypeList
			if (this.state.editingDocument.id) {
				await Request.updateDocument(this.state.editingDocument.id, document)
			} else {
				await Request.addDocument(document)
			}
			this.queryDocuments()
			this.setState({
				showDocumentEditor: false
			})
		} catch (error) {
			console.log(error)
		} finally {
			this.setState({
				saving: false
			})
		}
	}

	async queryDocuments(query) {
		try {
			this.setState({
				loading: true
			})
			const { pageSize } = this.state.pagination
			const { rows, count } = await Request.queryDocuments({ pageSize, ...query })
			this.state.pagination.total = count
			this.setState({
				documents: rows,
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
		this.queryDocuments({page: 1, ...(date? {generatedAtFrom: date.format('YYYY-MM'), generatedAtTo: moment(date).add(1, 'month').format('YYYY-MM')}: {}) })
	}

	componentDidMount() {
		this.queryDocuments()
	}

	render() {
		return (
			<div>
				<div className="App-layout-header">
					<div>
						<span className="App-layout-title" style={{
							marginRight: '12px'
						}}>凭证列表</span>
						<DatePicker bordered={false} placeholder="点击选择月份" onChange={this.changeDate.bind(this)} picker="month" />
					</div>
					<Button
						type="primary"
						shape="round"
						onClick={this.showDocumentEditor.bind(this)}
						icon={<PlusOutlined />}
					>添加凭证</Button>
				</div>
				<Modal
					visible={this.state.showDocumentEditor}
					title={`${this.state.editingDocument.id && '编辑' || '添加'}凭证`}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						<Button key="back" onClick={this.handleCancel}>取消</Button>,
						<Button key="submit" type="primary" loading={this.state.saving} onClick={this.handleOk}>保存</Button>,
					]}
				>
					<DocumentEditor key={this.state.count} formRef={this.state.formRef} document={this.state.editingDocument} onFinish={this.onFinish.bind(this)} />
				</Modal>

				<Table
					className="App-main-table"
					columns={this.columns}
					dataSource={this.state.documents}
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
								onClick={this.showDocumentEditor.bind(this)}
								icon={<PlusOutlined />}
							>添加凭证</Button>
						</Empty>
					}}
				/>
			</div>
		)
	}
}

export default withRouter(Container)