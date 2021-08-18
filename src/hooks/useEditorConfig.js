import { useCallback }  from 'react';
import { DefaultElement } from "slate-react";
import isHotkey from 'is-hotkey';

import Link from '../components/Link';
import Image from '../components/Image';
import { toggleStyle } from '../utils'

const renderElement = (props) => {
  const { element, children, attributes } = props;
  switch (element.type) {
    case "paragraph":
      return <p {...attributes}>{children}</p>;
    case "h1":
      return <h1 {...attributes}>{children}</h1>;
    case "h2":
      return <h2 {...attributes}>{children}</h2>;
    case "h3":
      return <h3 {...attributes}>{children}</h3>;
    case "h4":
      return <h4 {...attributes}>{children}</h4>;
    case "link":
      return <Link url={element.url} {...props}/>
    case "image":
      return <Image {...props}/>;
    default:
      // For the default case, we delegate to Slate's default rendering.
      return <DefaultElement {...props} />;
  }
}

function renderLeaf({ attributes, children, leaf }) {
  let el = <>{children}</>;

  if (leaf.bold) {
    el = <strong>{el}</strong>;
  }

  if (leaf.code) {
    el = <code>{el}</code>;
  }

  if (leaf.italic) {
    el = <em>{el}</em>;
  }

  if (leaf.underline) {
    el = <u>{el}</u>;
  }

  return <span {...attributes}>{el}</span>;
}

const KeyBindings = {
  onKeyDown: (editor, event) => {
    if (isHotkey("mod+b", event)) {
      toggleStyle(editor, "bold");
      return;
    }
    if (isHotkey("mod+i", event)) {
      toggleStyle(editor, "italic");
      return;
    }
    if (isHotkey("mod+c", event)) {
      toggleStyle(editor, "code");
      return;
    }
    if (isHotkey("mod+u", event)) {
      toggleStyle(editor, "underline");
      return;
    }
  },
};

export default function useEditorConfig(editor) {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return ["image"].includes(element.type) || isVoid(element);
  };

  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editor, event),
    [editor]
  )

  editor.isInline = (element) => ["link"].includes(element.type);

  return {
    renderElement,
    renderLeaf,
    onKeyDown
  };
}

