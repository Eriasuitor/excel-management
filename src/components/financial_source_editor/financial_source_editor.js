import React from 'react';
import { Form, Input} from 'antd';
import { withRouter } from 'react-router'

class Component extends React.Component {

  formRef = React.createRef();

  render() {
    return (
      <Form
        name="validate_other"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        ref={this.props.formRef}
        onFinish={this.props.onFinish}
        initialValues={this.props.financialSource || {}}
      >
        <Form.Item
          name="name"
          label="资金渠道名称"
          rules={[
            { required: true, message: '请输入资金渠道名称' },
            { max: 32, message: '资金渠道名称最长为32个字符' }
          ]}
        >
          <Input placeholder='请输入资金渠道名称' />
        </Form.Item>

        <Form.Item
          name="desc"
          label="描述"
          rules={[
            { max: 255, message: '资金渠道名称最长为255个字符' }
          ]}
        >
          <Input.TextArea autoSize />
        </Form.Item>
      </Form>
    );
  }
}

export default withRouter(Component);