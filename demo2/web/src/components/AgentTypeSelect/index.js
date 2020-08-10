import React, { Component } from 'react';
import { Modal, Checkbox, Button, Icon } from 'antd';
import styles from './index.less';
import message from '../Message';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import throttle from 'lodash/throttle';
import hotLineSrv from '@/service/hotLine';

class AgentTypeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      loading: true,
      autoExpandParent: true,
      selectedHotLineKeys: props.hotLineValue || [],
      selectedAgentTypeKeys: (props.value || []).map((each) => each.id)
    };
  }

  componentDidMount() {
    this.initData();
  }

  componentDidUpdate(prevProps) {
    // 目前不需要监听 visible change
    if (!_.isEqual(this.props.value, prevProps.value)) {
      this.setState({
        selectedAgentTypeKeys: (this.props.value || []).map((each) => each.id)
      });
    }
  }

  initData = async () => {
    let hotLines = [];
    let xAgentTypes = [];
    let resHotLine = await hotLineSrv
      .getList({ pageSize: 100 })
      .catch((e) => {});
    if (resHotLine && resHotLine.success) {
      hotLines = resHotLine.data || [];
    }

    let resAgentType = await hotLineSrv.getAgentTypeList().catch((e) => {});

    this.setState({
      loading: false
    });
    if (resAgentType && resAgentType.success) {
      xAgentTypes = (resAgentType.data || []).map((item) => ({
        id: item.agentType,
        agentType: item.agentTypeName
      }));
    }

    this.setState({
      agentList: xAgentTypes,
      hotLines: hotLines
    });
  };

  onClose = () => {
    const { onClose } = this.props;
    if (_.isFunction(onClose)) {
      onClose();
    }
  };

  handleOk = () => {
    const { onChange } = this.props;
    let { selectedHotLineKeys, selectedAgentTypeKeys, agentList } = this.state;

    // if (_.isEmpty(selectedAgentTypeKeys)) {
    //   return message.warning('请选择坐席类别');
    // }

    if (_.isFunction(onChange)) {
      onChange({
        hotLineValue: selectedHotLineKeys,
        value: _.map((selectedAgentTypeKeys || []).sort(), (each) => {
          return _.find(agentList, (item) => item.id === each);
        })
      });
    }
  };

  handleAgentTypeChange = (value) => {
    this.setState({
      selectedAgentTypeKeys: value
    });
  };

  handleHotLineChange = async (hotLineId) => {
    if (_.isUndefined(hotLineId) || _.isEmpty(hotLineId)) {
      this.setState({
        selectedHotLineKeys: hotLineId,
        currAgentTypes: [],
        selectedAgentTypeKeys: []
      });

      return;
    }

    this.setState({
      selectedHotLineKeys: hotLineId,
      selectedAgentTypeKeys: []
    });

    this.getCurrAgentTypes(hotLineId);
  };

  getCurrAgentTypes = async (hotLineIds) => {
    let res = await hotLineSrv.getAgentTypesByIds({ hotLineIds });

    if (res && res.success && !_.isEmpty(res.data)) {
      let t = (res.data.skillGroupList || []).map((each) => String(each.id));

      this.setState({
        currAgentTypes: t
      });
    }
  };

  render() {
    const {
      agentList = [],
      hotLines = [],
      selectedAgentTypeKeys,
      selectedHotLineKeys,
      currAgentTypes,
      loading
    } = this.state;

    let agentTypeDataSource = [];

    if (!_.isEmpty(currAgentTypes)) {
      agentTypeDataSource = agentList.filter(
        (each) => currAgentTypes.indexOf(String(each.id)) >= 0
      );
    }

    return (
      <div className={styles.agentTypeCom}>
        <div className="agent-type__header">选择坐席类别</div>
        <div className="agent-type__body">
          <div className="agent-type__side left">
            <div className="agent-type__side-header">热线参数</div>
            <div className="agent-type__side-body">
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                  <Icon style={{ fontSize: 24 }} type="loading" />
                </div>
              ) : (
                <Checkbox.Group
                  value={selectedHotLineKeys}
                  onChange={this.handleHotLineChange}>
                  {(hotLines || []).map((item, index) => {
                    return (
                      <div
                        key={item.hotLineId}
                        className={styles.selectedCheckbox}>
                        <Checkbox value={item.hotLineId}>
                          {item.hotLineName || ''}
                        </Checkbox>
                      </div>
                    );
                  })}
                </Checkbox.Group>
              )}
            </div>
          </div>

          <div className="agent-type__side right">
            <div className="agent-type__side-header">坐席类别</div>
            <div className="agent-type__side-body">
              <Checkbox.Group
                value={selectedAgentTypeKeys}
                onChange={this.handleAgentTypeChange}>
                {(agentTypeDataSource || []).map((item, index) => {
                  return (
                    <div key={item.id} className={styles.selectedCheckbox}>
                      <Checkbox value={item.id}>
                        {item.agentType || ''}
                      </Checkbox>
                    </div>
                  );
                })}
              </Checkbox.Group>
            </div>
          </div>
        </div>
        <div className="agent-type__footer">
          <Button style={{ marginRight: '15px' }} onClick={this.onClose}>
            取消
          </Button>
          <Button type="primary" onClick={this.handleOk}>
            确定
          </Button>
        </div>
      </div>
    );
  }
}

export default AgentTypeModal;
