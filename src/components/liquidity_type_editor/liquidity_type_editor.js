import React from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Radio, Slider, Button, Upload, Icon, Rate, Checkbox, Row, Col, } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router'

const { Option } = Select;

class Component extends React.Component {

  render() {
    return (
      <Form
        name="validate_other"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        ref={this.props.formRef}
        onFinish={this.props.onFinish}
        initialValues={this.props.liquidityType || {}}
      >
        <Form.Item
          name="projectName"
          label="所属项目"
          rules={[
            { required: true, message: '请选择所属项目' }
          ]}
        >
          <Input disabled></Input>
        </Form.Item>

        <Form.Item
          name="parentType"
          label="收支"
          rules={[
            { required: true, message: '请选择收入或支出' }
          ]}
        >
          <Select placeholder="请选择收入或支出" disabled={this.props.liquidityType && this.props.liquidityType.parentType}>
        <Option value="income">收入</Option>
            <Option value="expense">支出</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="type"
          label="类型"
          rules={[
            { required: true, message: '请选择收支类型' },
            { max: 32, message: '收支类型最长为32个字符' }
          ]}
        >
          <Input placeholder='请输入收支类型（如人员经费）' />
        </Form.Item>
      </Form>
    );
  }
}

export default withRouter(Component);