import React from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Radio, Slider, Button, Upload, Icon, Rate, Checkbox, Row, Col, } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router'

const { Option } = Select;

class Component extends React.Component {
  
  /**
   * [{name, label, requiredMsg, max, rules, input}]
   */

  render() {
    return (
      <Form
        name="validate_other"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        ref={this.props.formRef}
        onFinish={this.props.onFinish}
        initialValues={this.props.data || {}}
      >
        {this.props.rows.map(({name, label, required, requiredMsg, rules = [], input}) => {
          return <Form.Item
          name={name}
          label={label}
          key={name}
          rules={[
            { required: required || !!requiredMsg, message: requiredMsg || `请输入${label}` },
            ...rules
          ]}
        >
          {input}
        </Form.Item>
        })}
      </Form>
    );
  }
}

export default withRouter(Component);