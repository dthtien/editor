import { Button, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSlateStatic } from "slate-react";

import {
  getIconForButton,
  getLabelForBlockStyle,
  getActiveStyles,
  toggleStyle
} from '../utils'

const PARAGRAPH_STYLES = ["h1", "h2", "h3", "h4", "paragraph", "multiple"];
const CHARACTER_STYLES = ["bold", "italic", "underline", "code", "image", "link"];

export default function Toolbar({ selection }) {
  const editor = useSlateStatic();
  const buttonType = (style) => (getActiveStyles(editor).has(style) ? 'primary' : 'default' );
  const menu = (
    <Menu>
      {
        PARAGRAPH_STYLES.map((blockType) => (
          <Menu.Item eventKey={blockType} key={blockType}>
            {getLabelForBlockStyle(blockType)}
          </Menu.Item>
        ))
      }
    </Menu>
  );

  return (
    <Space wrap>
      <Dropdown overlay={menu}>
        <Button>
          {getLabelForBlockStyle("paragraph")}
          <DownOutlined />
        </Button>
      </Dropdown>
      {
        CHARACTER_STYLES.map((style) => (
          <Button
            key={style}
            icon={getIconForButton(style)}
            type={buttonType(style)}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleStyle(editor, style);
            }}
          />
        ))
      }
    </Space>
  );
}

