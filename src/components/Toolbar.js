import { Button, Menu, Dropdown, Space } from 'antd';
import { useCallback } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useSlateStatic } from "slate-react";

import {
  getIconForButton,
  getLabelForBlockStyle,
  getActiveStyles,
  toggleStyle,
  toggleBlockType,
  getTextBlockStyle,
  isLinkNodeAtSelection,
  toggleLinkAtSelection
} from '../utils'

const PARAGRAPH_STYLES = ["h1", "h2", "h3", "h4", "paragraph", "multiple"];
const CHARACTER_STYLES = ["bold", "italic", "underline", "code", "image"];

export default function Toolbar({ selection }) {
  const editor = useSlateStatic();
  const buttonType = (style) => (getActiveStyles(editor).has(style) ? 'primary' : 'default' );
  const linkStyle = () => (isLinkNodeAtSelection(editor, editor.selection) ? 'primary' : 'default' );
  const onBlockTypeChange = useCallback(
    (targetType) => {
      if (targetType === 'multiple') return;

      toggleBlockType(editor, targetType);
    },
    [editor]
  );
  const blockType = getTextBlockStyle(editor);

  const menu = (
    <Menu>
      {
        PARAGRAPH_STYLES.map((blockType) => (
          <Menu.Item key={blockType} onMouseDown={() => onBlockTypeChange(blockType)} >
            {getLabelForBlockStyle(blockType)}
          </Menu.Item>
        ))
      }
    </Menu>
  );

  return (
    <Space wrap>
      <Dropdown overlay={menu} disabled={blockType == null}>
        <Button>
          {getLabelForBlockStyle(blockType ?? "paragraph")}
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
      <Button
        key='link'
        icon={getIconForButton('link')}
        type={linkStyle()}
        onMouseDown={() => toggleLinkAtSelection(editor)}
      />
    </Space>
  );
}

