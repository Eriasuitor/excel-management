import React from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Radio, Slider, Button, Upload, Icon, Rate, Checkbox, Row, Col, } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router'

const { Option } = Select;

class Component extends React.Component {

  formRef = React.createRef();

  render() {
    console.log(this.props)
    return (
      <Form
        name="validate_other"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        ref={this.props.formRef}
        onFinish={this.props.onFinish}
        initialValues={{

        }}
      >
        <Form.Item
          name="name"
          label="项目名称"
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 32, message: '项目名称最长为32个字符' }
          ]}
        >
          <Input placeholder='请输入项目名称' />
        </Form.Item>

        <Form.Item
          name="desc"
          label="描述"
          rules={[
            { max: 255, message: '项目名称最长为255个字符' }
          ]}
        >
          <Input.TextArea autoSize />
        </Form.Item>
      </Form>
    );
  }
}

export default withRouter(Component);