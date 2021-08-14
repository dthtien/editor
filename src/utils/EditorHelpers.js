import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  UnderlineOutlined,
  FileImageOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { Editor } from "slate";

const getLabelForBlockStyle = (style) => {
  switch (style) {
    case "h1":
      return "Heading 1";
    case "h2":
      return "Heading 2";
    case "h3":
      return "Heading 3";
    case "h4":
      return "Heading 4";
    case "paragraph":
      return "Paragraph";
    case "multiple":
      return "Multiple";
    default:
      throw new Error(`Unhandled style in getLabelForBlockStyle: ${style}`);
  }
}

function getIconForButton(style) {
  switch (style) {
    case "bold":
      return <BoldOutlined />;
    case "italic":
      return <ItalicOutlined />;
    case "code":
      return <CodeOutlined />;
    case "underline":
      return <UnderlineOutlined />;
    case "image":
      return <FileImageOutlined />;
    case "link":
      return <LinkOutlined />;
    default:
      throw new Error(`Unhandled style in getIconForButton: ${style}`);
  }
}

function getActiveStyles(editor) {
  return new Set(Object.keys(Editor.marks(editor) ?? {}))
}

function toggleStyle(editor, style) {
  const activeStyles = getActiveStyles(editor);
  if (activeStyles.has(style)) {
    Editor.removeMark(editor, style);
  } else {
    Editor.addMark(editor, style, true);
  }
}


export {
  getLabelForBlockStyle,
  getIconForButton,
  getActiveStyles,
  toggleStyle
} ;
