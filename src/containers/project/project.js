import React from 'react';
import { Table, Modal, Button, Form } from 'antd';
import './project.css'
import { withRouter } from 'react-router'
import ProjectEditor from '../../components/project_editor/project_editor';
import { PlusOutlined } from '@ant-design/icons';
import * as Request from '../../network/request'

class Container extends React.Component {
	columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			width: 150,
			key: 'name'
		},
		{
			title: 'Age',
			dataIndex: 'age',
			width: 150,
			key: 'age'
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address'
		},
	];

	state = {
		showDocumentEditor: false,
		saving: false
	}

	async componentDidMount() {
		try {
			const {count, rows} = await Request.queryProjects()
			console.log({count, rows})
		} catch (error) {
			
		}
	}

	handleOk = e => {
		this.state.formRef.current.submit()
	};

	async handleFinish(project) {
		try {
			this.setState({
				saving: true
			})
			await Request.addProject(project)
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

	handleCancel = e => {
		this.setState({
			showDocumentEditor: false
		});
	};

	showDocumentEditor() {
		this.setState({
			formRef: React.createRef(),
			showDocumentEditor: true
		})
	}

	render() {
		return (
			<div>
				<Button
					type="primary"
					shape="round"
					onClick={this.showDocumentEditor.bind(this)}
					icon={<PlusOutlined />}
				>
					新增项目
        </Button>
				<Modal
					visible={this.state.showDocumentEditor}
					title={`${this.props.action || '新增'}项目`}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						<Button key="back" onClick={this.handleCancel}>
							取消
            </Button>,
						<Button key="submit" type="primary" loading={this.state.saving} onClick={this.handleOk}>
							保存
            </Button>,
					]}
				>
					<ProjectEditor formRef={this.state.formRef}  onFinish={this.handleFinish.bind(this)}/>
				</Modal>
				{/* <Table 
	   columns={this.columns} 
	   dataSource={[{name: 1, age: 2, address: '??'}]} 
	   pagination={{ pageSize: 50 }} 
	   scroll={{ y: 2404 }} 
	   size="small"
	   /> */}
			</div>
		)
	}
}

export default withRouter(Container)