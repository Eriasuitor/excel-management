import React from 'react';
import { Form, Input, InputNumber} from 'antd';
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
        onFinish={(value) => {
          console.log(this.props.financialSource)
          if(this.props.financialSource && this.props.financialSource.id) {
            delete value.initialStock
          }
          this.props.onFinish(value)
        }}
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
          label="初始余额"
          name="initialStock"
          rules={[{ required: true, message: '请输入初始余额' }]}
        >
          <Form.Item
            name="initialStock"
            noStyle
          >
            <InputNumber style={{ width: '34%' }} min={0} step={0.01} precision={2} disabled={this.props.financialSource && this.props.financialSource.id}></InputNumber>
          </Form.Item>
            <span className="ant-form-text">元</span>
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