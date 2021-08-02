import {memo, useCallback, useState} from 'react';
import {Tabs} from "antd";
import {useDrop} from "react-dnd";
import update from "immutability-helper";
import {Card} from "./Card";

type Props = {
  [key:string]:any;
};


const TabBar = memo(
  (props: Props) => {
      const {activeTab} = props;

      const initialPanes = [
          {title: 'Tab 1', content: 'Content of Tab 1', key: '1'},
          {title: 'Tab 2', content: 'Content of Tab 2', key: '2'},
          {title: 'Tab 3', content: 'Content of Tab 3', key: '3'},
          {title: 'Tab 4', content: 'Content of Tab 4', key: '4'},
          {title: 'Tab 5', content: 'Content of Tab 5', key: '5'},
          {title: 'Tab 6', content: 'Content of Tab 6', key: '6'},
          {title: 'Tab 7', content: 'Content of Tab 7', key: '7'},
      ];

      const [panes, setPanes] = useState(initialPanes);
      const [activeKey, setActiveKey] = useState(initialPanes[0].key);

      const onChange = activeKey => {
          setActiveKey(activeKey);
      };

      const onEdit = (targetKey, action) => {
          console.log(targetKey, action);
          add();
      };

      const add = () => {
          const activeKey = `newTab${+new Date()}`;
          const newPanes = [...panes];
          newPanes.push({title: 'New Tab', content: 'Content of new Tab', key: activeKey});
          setPanes(newPanes);
          setActiveKey(activeKey);
      };

      const [, drop] = useDrop(() => ({accept: 'acceptSortKey'}));

      const find = useCallback(
          (id: string) => {
              const card = panes.filter((c) => `${c.key}` === id)[0]
              return {
                  card,
                  index: panes.indexOf(card),
              }
          },
          [panes],
      )

      const move = useCallback(
          (id: string, atIndex: number) => {
              const {card, index} = find(id)
              setPanes(
                  update(panes, {
                      $splice: [
                          [index, 1],
                          [atIndex, 0, card],
                      ],
                  }),
              )
          },
          [find, panes, setPanes],
      )


      const renderTabBar = (props, DefaultTabBar) => {
          console.log(props, 'dd:', DefaultTabBar);

          return <div aaa='aaa' ref={drop}><DefaultTabBar bbb="bbb" {...props}>
              {(node) => {
                  console.log('node:', node);
                  //return <div>a</div>;
                  /*return <div key={node.key} index1={node.key} ddd="moveTabNode">
                      {node}
                  </div>*/

                  return <Card
                      key={node.key}
                      id={`${node.key}`}
                      text={node.key}
                      move={move}
                      find={find}
                  >{node}</Card>;
              }}
          </DefaultTabBar></div>
          /*<div>
              {({ style }) => (
                  <DefaultTabBar {...props} className="site-custom-tab-bar" style={{ ...style }} />
              )}
          </div>*/
      };


      /* const tabBarExtraContent = {
           left: <div>left</div>,
           right: <div>right</div>
       };*/

      return <Tabs
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
          renderTabBar={renderTabBar}
          /*tabBarExtraContent={tabBarExtraContent}*/
      >
          {panes.map(pane => (
              <Tabs.TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                  {pane.content}
              </Tabs.TabPane>
          ))}
      </Tabs>;
  },
  () => {
    return true;
  },
);
export default TabBar;
