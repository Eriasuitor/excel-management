import React from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Radio, Slider, Button, Upload, Icon, Rate, Checkbox, Row, Col, } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router'

const { Option } = Select;
const formItemLayout = {

};

const normFile = e => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};


class Component extends React.Component {

  render() {
    const onFinish = values => {
      console.log('Received values of form: ', values);
    };

    return (
      <Form
        name="validate_other"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onFinish={onFinish}
        initialValues={{

        }}
      >
        <Form.Item
          name="project"
          label="项目名称"
          rules={[{ required: true, message: '请选择项目' }]}
        >
          <Select placeholder="请选择项目">
            <Option value="china">China</Option>
            <Option value="usa">U.S.A</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="financialSource"
          label="资金渠道"
          rules={[{ required: true, message: '请选择资金渠道' }]}
        >
          <Select mode="multiple" placeholder="请选择资金渠道">
            <Option value="red">Red</Option>
            <Option value="green">Green</Option>
            <Option value="blue">Blue</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="凭证号"
          name="humanReadableId"
          rules={[{ required: true, message: '请输入凭证号' }]}
        >
          <Input placeholder='请输入凭证号' />
        </Form.Item>

        <Form.Item
          label="摘要"
          name="abstract"
          rules={[{ required: true, message: '请输入摘要' }]}
        >
          <Input.TextArea placeholder='请输入摘要' autoSize />
        </Form.Item>

        <Form.Item
          label="消费类型"
          name="liquidityType"
          rules={[{ required: true, message: '请选择消费类型' }]}
        >
          <Input.Group compact>
            <Select style={{ width: '35%' }} placeholder="选择类型">
              <Option value="income">收入</Option>
              <Option value="expense">支出</Option>
            </Select>
            <Select style={{ width: '65%' }} placeholder="选择子类型">
              <Option value="income">收asdasdasd入收asdasdasd入收asdasdasd入收asdasdasd入</Option>
              <Option value="expense">支支出支出支出出</Option>
            </Select>
          </Input.Group>
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
            <span className="ant-form-text">元</span>
          </Form.Item>
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
          <Input placeholder='请输入经办人' />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea autoSize />
        </Form.Item>
      </Form>
    );
  }
}

export default withRouter(Component);