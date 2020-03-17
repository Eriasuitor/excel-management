import React from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Cascader, Slider, Button, Upload, Icon, Rate, Checkbox, Row, Col, } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router'
import * as Request from '../../network/request'

const { Option } = Select;

class Component extends React.Component {

  state = {
    projects: [],
    financialSources: [],
    projectId: null,
    cascadeOptions: [{
      label: '收入',
      value: 'income',
      children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
      }]
    }, {
      label: '支出',
      value: 'expense',
      children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
      }]
    }]
  }

  async componentDidMount() {
    try {
      const [{ rows: ps }, { rows: fss }] = await Promise.all([
        Request.queryProjects({ pageSize: 10000 }),
        Request.queryFinancialSource({ pageSize: 10000 })
      ])
      this.setState({ projects: ps, financialSources: fss, projectId: (this.props.document || {}).projectId})
    } catch (error) {

    }
  }

  handleProjectChange(value) {
    const liquidityTypes = this.state.projects.find(_ => _.id === value).liquidityTypes
    this.setState({
      projectId: value,
      cascadeOptions: [{
        label: '收入',
        value: 'income',
        children: liquidityTypes.filter(_ => _.parentType === 'income').map(liquidityType => ({
          value: liquidityType.id,
          label: liquidityType.type,
        }))
      }, {
        label: '支出',
        value: 'expense',
        children: liquidityTypes.filter(_ => _.parentType === 'expense').map(liquidityType => ({
          value: liquidityType.id,
          label: liquidityType.type,
        }))
      }]
    })
  }

  render() {
    return (
      <Form
        name="validate_other"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        ref={this.props.formRef}
        onFinish={this.props.onFinish}
        initialValues={this.props.document || {}}
      >
        <Form.Item
          name="projectId"
          label="项目名称"
          key="projectId"
          rules={[{ required: true, message: '请选择项目' }]}
        >
          <Select
            placeholder="请选择项目"
            onChange={this.handleProjectChange.bind(this)}
          >
            {this.state.projects.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          name="liquidityTypeList"
          label="消费类型"
          key="liquidityType"
          rules={[{ required: true, message: '请选择消费类型' }]}
        >
          <Cascader
            placeholder={this.state.projectId ? '请选择消费类型' : '请先指定项目'}
            disabled={!this.state.projectId}
            options={this.state.cascadeOptions}
          />
        </Form.Item>

        <Form.Item
          name="financialSourceId"
          label="资金渠道"
          key="financialSourceId"
          rules={[{ required: true, message: '请选择资金渠道' }]}
        >
          <Select placeholder="请选择资金渠道">
            {this.state.financialSources.map(fs => <Option key={fs.id} value={fs.id}>{fs.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item
          label="凭证号"
          name="humanReadableId"
          key="humanReadableId"
          rules={[{ required: true, message: '请输入凭证号' }]}
        >
          <Input placeholder='请输入凭证号' />
        </Form.Item>

        <Form.Item
          label="摘要"
          name="abstract"
          key="abstract"
          rules={[{ required: true, message: '请输入摘要' }]}
        >
          <Input.TextArea placeholder='请输入摘要' autoSize />
        </Form.Item>

        <Form.Item
          label="金额"
          name="amount"
          rules={[{ required: true, message: '请输入金额' }]}
        >
          <Form.Item
            name="amount"
            noStyle
          >
            <InputNumber style={{ width: '34%' }} min={0} step={0.01} precision={2}></InputNumber>
          </Form.Item>
            <span className="ant-form-text">元</span>
        </Form.Item>

        <Form.Item
          label="发生时间"
          name="generatedAt"
          rules={[{ required: true, message: '请选择发生时间' }]}
        >
          <Form.Item name="generatedAt" noStyle >
            <DatePicker placeholder="请选择发生时间" />
          </Form.Item>
        </Form.Item>

        <Form.Item label="经办人" name="handler">
          <Input />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea autoSize />
        </Form.Item>

      </Form>
    );
  }
}

export default withRouter(Component);