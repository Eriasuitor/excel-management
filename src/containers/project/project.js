import React from 'react';
import { Table, Modal, Button, Empty, message, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './project.css'
import { withRouter } from 'react-router'
import ProjectEditor from '../../components/project_editor/project_editor';
import LiquidityTypeEditor from '../../components/liquidity_type_editor/liquidity_type_editor';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as Request from '../../network/request'
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
			title: '操作',
			key: 'operation',
			render: (project) => (
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
						title="编辑此项目"
						onClick={this.showProjectEditor.bind(this, {
							id: project.id,
							name: project.name,
							desc: project.desc
						})}
					></Button>
					<Popconfirm
						onClick={e  => e.stopPropagation()}
						onCancel={e  => e.stopPropagation()}
						title={`你确定要删除项目“${project.name}”吗？`}
						icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
						
						onConfirm={this.removeProject.bind(this, project.id)}
					>
						<Button
						 title="删除此项目" 
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
					<Button
						className="App-small-font"
						type="primary"
						shape="circle"
						icon={<PlusOutlined />}
						size="small"
						title="添加收支类型"
						onClick={this.showLiquidityTypeEditor.bind(this, {
							projectName: project.name,
							projectId: project.id
						})}
					></Button>
				</span>
			),
		},
	];

	state = {
		showProjectEditor: false,
		showLiquidityTypeEditor: false,
		savingLiquidityType: false,
		saving: false,
		projects: [],
		loading: false,
		editingLiquidityType: {},
		editingProject: {},
		liquidityTypeEditorCount: 1,
		projectEditorCounter: 1,
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		}
	}

	async componentDidMount() {
		this.queryProjects()
	}

	async queryProjects(page = 1) {
		try {
			this.setState({
				loading: true
			})
			const {pageSize}  = this.state.pagination
			const { count, rows } = await Request.queryProjects({
				page, pageSize
			})
			this.state.pagination.total = count
			this.setState({
				projects: rows,
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
		console.log({pagination, filters, sorter})
		this.setState({
			pagination
		})
		this.queryProjects(pagination.current)
	};

	handleOk = e => {
		this.state.formRef.current.submit()
	};

	async handleFinish(project) {
		try {
			this.setState({
				saving: true
			})
			if (this.state.editingProject.id) {
				await Request.updateProject(this.state.editingProject.id, project)
			} else {
				await Request.addProject(project)
			}
			this.queryProjects()
			this.setState({
				showProjectEditor: false
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
			showProjectEditor: false
		});
	};

	cancelLiquidityEditorModel() {
		this.setState({
			showLiquidityTypeEditor: false
		})
	}

	async handleLiquidityFinish(liquidityType) {
		try {
			delete liquidityType.projectName
			this.setState({ savingLiquidityType: true })
			if (this.state.editingLiquidityType.parentType) {
				await Request.updateLiquidityType(this.state.editingLiquidityType.id, { type: liquidityType.type })
			} else {
				await Request.addLiquidityType(this.state.editingLiquidityType.projectId, liquidityType)
			}
			this.setState({
				showLiquidityTypeEditor: false
			})
			message.success('保存成功')
			this.queryProjects()
		} catch (error) {

		} finally {
			this.setState({ savingLiquidityType: false })
		}
	}

	async removeLiquidityType(liquidityType, project) {
		try {
			await Request.removeLiquidityType(liquidityType.id)
			project.liquidityTypes = project.liquidityTypes.filter(_ => _.id !== liquidityType.id)
			this.setState({
				projects: this.state.projects
			})
			message.success('删除成功')
		} catch (error) {
		} finally {

		}
	}

	async removeProject(projectId, e) {
		e.stopPropagation()
		try {
			await Request.removeProject(projectId)
			this.setState({
				projects: this.state.projects.filter(_ => _.id !== projectId)
			})
			message.success('删除成功')
		} catch (error) {
		} finally {

		}
	}

	showProjectEditor(project, e) {
		e && e.stopPropagation()
		this.setState({
			formRef: React.createRef(),
			showProjectEditor: true,
			projectEditorCounter: this.state.projectEditorCounter + 1,
			editingProject: project
		})
	}

	addLiquidityType(liquidityType) {
		try {

		} catch (error) {

		}
	}

	showLiquidityTypeEditor(editingLiquidityType, e) {
		e.stopPropagation()
		this.setState({
			liquidityTypeFormRef: React.createRef(),
			showLiquidityTypeEditor: true,
			editingLiquidityType,
			liquidityTypeEditorCount: this.state.liquidityTypeEditorCount + 1
		})
	}

	expandedRowRender(project) {
		const columns = [
			{ title: '收支', dataIndex: 'parentType', key: 'parentType', render: parentType => Translator.parentType2HumanReadable(parentType) },
			{ title: '类型', dataIndex: 'type', key: 'type' },
			{
				title: '操作',
				key: 'operation',
				render: (liquidityType) => (
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
							title="编辑此收支类型"
							onClick={this.showLiquidityTypeEditor.bind(this, {
								projectName: project.name,
								projectId: project.id,
								id: liquidityType.id,
								parentType: liquidityType.parentType,
								type: liquidityType.type
							})}
						></Button>
						<Popconfirm
							title={`你确定要删除${Translator.parentType2HumanReadable(liquidityType.parentType)}类型“${liquidityType.type}吗？`}
							icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
							onConfirm={this.removeLiquidityType.bind(this, liquidityType, project)}
						>
							<Button title="删除此收支类型" className="App-small-font" type="primary" shape='circle' icon={<DeleteOutlined />} size="small"></Button>
						</Popconfirm>

					</span>
				),
			},
		];
		const data = project.liquidityTypes;
		return <Table
			columns={columns}
			dataSource={data}
			rowKey={record => record.id}
			bordered
			pagination={false}
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
						onClick={this.showLiquidityTypeEditor.bind(this, {
							projectName: project.name,
							projectId: project.id
						})}
						icon={<PlusOutlined />}
					>添加资金流通类型</Button>
				</Empty>
			}}
			title={() => <span className="App-vice-font">此项目的收支类型列表</span>}
			size='small'
		/>;
	};

	render() {
		return (
			<div>
				<div className="App-layout-header">
					<div className="App-layout-title">项目列表</div>
					<Button
						type="primary"
						shape="round"
						onClick={this.showProjectEditor.bind(this)}
						icon={<PlusOutlined />}
					>新增项目</Button>
				</div>
				<Modal
					visible={this.state.showProjectEditor}
					title={`${this.state.editingProject.id && '编辑' || '新增'}项目`}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						<Button key="back" onClick={this.handleCancel}>取消</Button>,
						<Button key="submit" type="primary" loading={this.state.saving} onClick={this.handleOk}>保存</Button>,
					]}
				>
					<ProjectEditor formRef={this.state.formRef} onFinish={this.handleFinish.bind(this)} project={this.state.editingProject} key={this.state.projectEditorCounter} />
				</Modal>
				<Modal
					visible={this.state.showLiquidityTypeEditor}
					title={`${this.state.editingLiquidityType.parentType && '编辑' || '新增'}收支类型`}
					onOk={() => { this.state.liquidityTypeFormRef.current.submit() }}
					onCancel={this.cancelLiquidityEditorModel.bind(this)}
					footer={[
						<Button key="back" onClick={this.cancelLiquidityEditorModel.bind(this)}>取消</Button>,
						<Button key="submit" type="primary" loading={this.state.savingLiquidityType} onClick={() => { this.state.liquidityTypeFormRef.current.submit() }}>保存</Button>,
					]}
				>
					<LiquidityTypeEditor key={this.state.liquidityTypeEditorCount} formRef={this.state.liquidityTypeFormRef} onFinish={this.handleLiquidityFinish.bind(this)} liquidityType={this.state.editingLiquidityType} />
				</Modal>
				<Table
					className="App-main-table App-no-selector"
					columns={this.columns}
					dataSource={this.state.projects}
					scroll={{ y: 'calc(100vh - 320px)' }}
					rowKey={record => record.id}
					loading={this.state.loading}
					onChange={this.handleTableChange}
					expandable={{
						expandedRowRender: this.expandedRowRender.bind(this),
						expandRowByClick: true
					}}
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
								onClick={this.showProjectEditor.bind(this)}
								icon={<PlusOutlined />}
							>添加项目</Button>
						</Empty>
					}}
				/>
			</div>
		)
	}
}

export default withRouter(Container)