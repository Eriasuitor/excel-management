import React from 'react';
import { Steps, Button, message, Form, Select, Input, DatePicker, } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import Editor from '../../components/editor/editor'
import './export.css'
import { withRouter } from 'react-router'
import ProjectEditor from '../../components/project_editor/project_editor';
import LiquidityTypeEditor from '../../components/liquidity_type_editor/liquidity_type_editor';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as Request from '../../network/request'
import * as Translator from '../../util/translator'
import empty from '../../empty.svg'
import config from '../../config/index'
import * as download from 'downloadjs'

class Container extends React.Component {

	state = {
		currentStep: 0,
		worksheets: [],
		projects: [],
		submitting: false
	}

	componentDidMount() {
		this.queryProjects()
	}

	async queryProjects() {
		try {
			const { rows: projects } = await Request.queryProjects({ pageSize: Number.MAX_SAFE_INTEGER })
			this.setState({
				projects
			})
		} catch (error) {

		} finally {

		}
	}

	async export(value) {
		try {
			value.worksheets = value.worksheets || []
			value.worksheets.forEach(ws => {
				ws.year = ws.date.get('year')
				ws.month = ws.date.get('month')
				delete ws.date
			})
			this.setState({
				submitting: true
			})
			await Request.exportReport(value).then(function (resp) {
				return resp.blob()
			}).then(function (blob) {
				download(blob, `${value.filename}.xlsx`)
			})
		} catch (error) {

		} finally {
			this.setState({
				submitting: false
			})
		}
	}

	render() {
		return <div>
			<div className="App-layout-header">
				<div className="App-layout-title">导出</div>
			</div>
			<Form
				name="export"
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 14 }}
				ref={this.state.formRef}
				initialValues={{ filename: undefined, worksheets: [] }}
				onFinish={this.export.bind(this)}
			>
				<Form.Item
					name="filename"
					label="文件名称"
					key="filename"
					rules={[{ required: true, message: '请输入导出文件名称' }]}
				>
					<Input></Input>
				</Form.Item>
				{
					this.state.worksheets.map((ws, index) =>
						<Form.Item
							label={index === 0 ? 'sheets' : ''}
							key={`worksheets[${index}]`}
							wrapperCol={index === 0 ? { span: 14 } : { span: 14, offset: 6 }}
						>
							{/* style={{ display: 'inline-block', width: '62%' }} */}
							<Form.Item
								name={['worksheets', index, 'type']}
								key={`${index}type`}
								style={{ display: 'inline-block', marginBottom: 0, marginRight: '9px' }}
								rules={[{ required: true, message: '请选择报表类型' }]}
							>
								<Select
									showSearch
									placeholder="选出报表类型"
									optionFilterProp="children"
									style={{ width: 200 }}
									filterOption={(input, option) =>
										option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
									onChange={(value) => {
										this.state.worksheets[index].type = value
										this.setState({ worksheets: this.state.worksheets })
									}}
								>
									<Select.Option key='1' value="annualFinance">年度资金表</Select.Option>
									<Select.Option key='2' value="annualProject">所有项目年度收支表</Select.Option>
									<Select.Option key='3' value="annualSpecifiedProject">特定项目年度收支表</Select.Option>
									<Select.Option key='4' value="annualSpecifiedProjectDetail">特定项目年度收支明细表</Select.Option>
									<Select.Option key='5' value="monthlyDocument">所有项目月度凭证表</Select.Option>
									<Select.Option key='6' value="monthlyProject">特定项目月度凭证表</Select.Option>
								</Select>
							</Form.Item>
							{
								['annualSpecifiedProject', 'annualSpecifiedProjectDetail', 'monthlyProject'].includes(ws.type) &&
								<Form.Item
									name={['worksheets', index, 'projectId']}
									key={`${index}projectId`}
									style={{ display: 'inline-block', marginBottom: 0, marginRight: '9px' }}
									rules={[{ required: true, message: '请选择项目' }]}
								>
									<Select
										showSearch
										style={{ width: 200 }}
										placeholder="选择项目"
										optionFilterProp="children"
										filterOption={(input, option) =>
											option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}
									>
										{
											this.state.projects.map(project =>
												<Select.Option key={project.id} value={project.id}>{project.name}</Select.Option>
											)
										}
									</Select>
								</Form.Item>
							}
							<Form.Item
								name={['worksheets', index, 'date']}
								key={`${index}month`}
								style={{ display: 'inline-block', marginBottom: 0, marginRight: '9px' }}
								rules={[{ required: true, message: '请选择时间' }]}
							>
								<DatePicker picker={['monthlyDocument', 'monthlyProject'].includes(ws.type) && 'month' || 'year'} />
							</Form.Item>

							<Form.Item
								style={{ display: 'inline-block', marginBottom: 0, marginRight: '9px' }}
								shouldUpdate={(prevValues, curValues) => prevValues.users !== curValues.users}
							>
								{({ getFieldValue, setFieldsValue }) => {
									return <CloseCircleOutlined
										title='删除此条目'
										style={{ marginTop: '9px' }}
										onClick={() => {
											const worksheets = getFieldValue('worksheets') || []
											worksheets.splice(index, 1)
											setFieldsValue('worksheets', worksheets)
											this.state.worksheets.splice(index, 1)
											this.setState({
												worksheets: this.state.worksheets
											})

										}}
									/>
								}}
							</Form.Item>
						</Form.Item>
					)
				}
				<Form.Item
					label={this.state.worksheets.length === 0 ? 'sheets' : ''}
					wrapperCol={this.state.worksheets.length === 0 ? { span: 14 } : { span: 14, offset: 6 }}
				>
					<Button type="dashed" onClick={() => {
						this.state.worksheets.push({})
						this.setState({
							worksheets: this.state.worksheets
						})
					}} block>添加sheet</Button>
				</Form.Item>

				<Form.Item
					wrapperCol={{ span: 14, offset: 6 }}
				>
					<Button type="primary" htmlType="submit" block loading={this.state.submitting}>导出</Button>
				</Form.Item>
			</Form>
		</div >
	}
}

export default withRouter(Container)