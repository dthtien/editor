import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { useMemo, useCallback, useRef } from "react";

import { useEditorConfig, useSelection } from '../hooks'
import { isLinkNodeAtSelection, identifyLinksInTextIfAny } from '../utils'

import Toolbar from './Toolbar'
import LinkEditor from './LinkEditor'

export default function Editor({ document, onChange }) {
  const editorRef = useRef(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const { renderElement, renderLeaf, onKeyDown } = useEditorConfig(editor);
  const [previousSelection, selection, setSelection] = useSelection(editor);

  const onChangeHandler = useCallback(
    (doc) => {
      onChange(doc);
      setSelection(editor.selection);
      identifyLinksInTextIfAny(editor);
    },
    [editor, onChange, setSelection]
  );

  const parseEditorOffsets = () => {
    if (editorRef.current != null) {
      return (
        {
          x: editorRef.current.getBoundingClientRect().x,
          y: editorRef.current.getBoundingClientRect().y,
        }
      )
    }

    return null;
  }

  let selectionForLink = null;
  if (isLinkNodeAtSelection(editor, selection)) {
    selectionForLink = selection;
  } else if (
    selection == null &&
    isLinkNodeAtSelection(editor, previousSelection)
  ) {
    selectionForLink = previousSelection;
  }


  const CustomizedLinkEditor = () => {
    if (selectionForLink != null) {
      return(
        <LinkEditor
          editorOffsets={parseEditorOffsets()}
          selectionForLink={selectionForLink}
        />
      )
    }

    return null
  }

  return (
    <Slate editor={editor} value={document} onChange={onChangeHandler}>
      <Toolbar selection={selection} previousSelection={previousSelection} />
      <div className="editor" ref={editorRef}>
        <CustomizedLinkEditor />
        <Editable
          renderElement = {renderElement}
          renderLeaf = {renderLeaf}
          onKeyDown={onKeyDown}
        />
      </div>
    </Slate>
  );
}
