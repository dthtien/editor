import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  UnderlineOutlined,
  FileImageOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { Editor, Transforms, Range, Element, Text, Point } from "slate";
import isUrl from './isUrl';

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

function getTextBlockStyle(editor) {
  const selection = editor.selection;
  if (selection == null) return null;

  const [start, end] = Range.edges(selection);

  //path[0] gives us the index of the top-level block.
  let startTopLevelBlockIndex = start.path[0];
  const endTopLevelBlockIndex = end.path[0];

  let blockType = null;
  while (startTopLevelBlockIndex <= endTopLevelBlockIndex) {
    const [node, _] = Editor.node(editor, [startTopLevelBlockIndex]);
    if (blockType == null) {
      blockType = node.type;
    } else if (blockType !== node.type) {
      return "multiple";
    }
    startTopLevelBlockIndex++;
  }

  return blockType;
}

function toggleBlockType(editor, blockType) {
  const currentBlockType = getTextBlockStyle(editor);
  const changeTo = currentBlockType == blockType ? 'paragraph' : blockType;
  Transforms.setNodes(
    editor,
    { type: changeTo },
    { at: editor.selection, match: (n) => Editor.isBlock(editor, n) }
  );
}

function isLinkNodeAtSelection(editor, selection) {
  if (selection == null) {
    return false;
  }

  return (
    Editor.above(editor, {
      at: selection,
      match: (n) => n.type === "link",
    }) != null
  );
}

function toggleLinkAtSelection(editor) {
  if (!isLinkNodeAtSelection(editor, editor.selection)) {
    const isSelectionCollapsed =
      Range.isCollapsed(editor.selection);
    if (isSelectionCollapsed) {
      Transforms.insertNodes(
        editor,
        {
          type: "link",
          url: '#',
          children: [{ text: 'link' }],
        },
        { at: editor.selection }
      );
    } else {
      Transforms.wrapNodes(
        editor,
        { type: "link", url: '#', children: [{ text: '' }] },
        { split: true, at: editor.selection }
      );
    }
  } else {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "link",
    });
  }
}

const identifyLinksInTextIfAny = (editor) => {
  if (editor.selection == null || !Range.isCollapsed(editor.selection)) return;

  const [node, _] = Editor.parent(editor, editor.selection);

  if (node.type === 'link') return;

  const [currentNode, currentNodePath] = Editor.node(editor, editor.selection)
  if (!Text.isText(currentNode)) return;

  let [start] = Range.edges(editor.selection);
  const cursorPoint = start;

  const startPointOfLastCharacter = Editor.before(
    editor,
    editor.selection,
    { unit: 'character' }
  );

  const lastCharacter = Editor.string(
  editor,
    Editor.range(editor, startPointOfLastCharacter, cursorPoint)
  );

  if (lastCharacter !== ' ') return;

  let end = startPointOfLastCharacter;
  start = Editor.before(editor, end, { unit: 'character' });
  const startOfTextNode = Editor.point(editor, currentNodePath, { edge: 'start' });

  while(
    Editor.string(editor, Editor.range(editor, start, end)) !== ' ' &&
    !Point.isBefore(start, startOfTextNode)
  ) {
    end = start;
    start = Editor.before(editor, end, { unit: 'character' })
  }

  const lastWordRange = Editor.range(editor, end, startPointOfLastCharacter);
  const lastWord = Editor.string(editor, lastWordRange);

  if (isUrl(lastWord)) {
    Promise.resolve().then(() => {
      Transforms.wrapNodes(
        editor,
        { type: "link", url: lastWord, children: [{ text: lastWord }] },
        { split: true, at: lastWordRange }
      )
    });
  }
}

export {
  getLabelForBlockStyle,
  getIconForButton,
  getActiveStyles,
  toggleStyle,
  getTextBlockStyle,
  toggleBlockType,
  isLinkNodeAtSelection,
  toggleLinkAtSelection,
  identifyLinksInTextIfAny
};
