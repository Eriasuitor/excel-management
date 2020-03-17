import React from 'react';
import './App.css';
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Document from './containers/document/document';
import Project from './containers/project/project';
import FinancialSource from './containers/financial_source/financial_source';
import FinancialSourceTracker from './containers/financial_source_tracker/financial_source_tracker';
import config from './config/index';
import * as Request from './network/request'
import * as Translator from './util/translator'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
class App extends React.Component {
  constructor(props) {
    super(props)
    if (this.props.history.location.pathname === '/') {
      this.props.history.push('/documents')
    }
  }

  state = {
    systemInfo: {}
  }

  async componentDidMount() {
    const systemInfo = await Request.getSystemInfo()
    systemInfo.env =Translator.env2HumanReadable(systemInfo.env)
    this.setState({
      systemInfo
    })
  }

  render() {
    return (
      <Layout style={{
      }}>
        <Header className="header">
          <div className="logo" style={{
            width: "120px",
            height: "31px",
            background: "rgba(255, 255, 255, 0.2)",
            margin: "16px 28px 16px 0",
            float: "left"
          }}></div>
          <span className="App-header">内部财务管理系统</span>
          <span className="App-env">后端：<strong className={this.state.systemInfo.env === '环境错误'? 'App-error': ''}>{this.state.systemInfo.env}</strong></span>
          <span className="App-env">前端：<strong className={config.env === '环境错误'? 'App-error': ''}>{config.env}</strong></span>
        </Header>
        <Layout>
          <Sider
            className="App-no-selector"
            width={200} style={{ background: '#fff' }}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
            }}
            onCollapse={(collapsed, type) => {
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1', 'sub2', 'sub3']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" /> 会计功能
                  </span>
                }
              >
                <Menu.Item key="1" onClick={() => this.props.history.push('/documents')}>凭证管理</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="user" /> 出纳功能
                  </span>
                }
              >
                <Menu.Item key="2" onClick={() => this.props.history.push('/login')}>现金流水管理</Menu.Item>
                <Menu.Item key="3" onClick={() => this.props.history.push('/trackers')}>银行存款变动管理</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <Icon type="user" /> 管理员功能
                  </span>
                }
              >
                <Menu.Item key="3_1" onClick={() => this.props.history.push('/projects')}>项目管理</Menu.Item>
                <Menu.Item key="3_2" onClick={() => this.props.history.push('/financial-sources')}>资金渠道管理</Menu.Item>
                <Menu.Item key="3_3" onClick={() => this.props.history.push('/login')}>导出</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ 
            padding: '24px' ,
            height: 'calc(100vh - 64px)',
            }}>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                overflow: 'scroll'
              }}
            >
              <Switch>
                <Route path="/documents" exact component={Document} />
                <Route path="/projects" component={Project} />
                <Route path="/financial-sources" component={FinancialSource} />
                <Route path="/trackers" component={FinancialSourceTracker} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
export default withRouter(App);
