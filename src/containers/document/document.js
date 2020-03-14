import React from 'react';
import { Table, Modal, Button } from 'antd';
import './document.css'
import { withRouter } from 'react-router'
import DocumentEditor from '../../components/document_editor/document_editor';
import { PlusOutlined} from '@ant-design/icons';

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

	handleOk = e => {
		
	  };
	
	  handleCancel = e => {
		this.setState({
			showDocumentEditor: false
		});
	  };
	  
  render() {
    return (
      <div>
		 <Button 
		 type="primary"
		  shape="round" 
		  onClick={() => {this.setState({showDocumentEditor: true})}}
		  form={this.props.form}
		  icon={<PlusOutlined />}
		  >
          新增凭证
        </Button>
		 <Modal
          visible={this.state.showDocumentEditor}
          title="Title"
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
         <DocumentEditor />
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