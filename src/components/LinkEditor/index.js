import './style.css'
import { Input, Button } from 'antd';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ReactEditor, useSlateStatic } from "slate-react";
import { Editor, Transforms } from "slate";
import { isUrl } from '../../utils';

const LinkEditor = ({ editorOffsets, selectionForLink }) => {
  const linkEditorRef = useRef(null);
  const editor = useSlateStatic();
  const [node, path] = Editor.above(editor, {
    at: selectionForLink,
    match: (n) => n.type === "link",
  });
  const [linkURL, setLinkURL] = useState(node.url);

  useEffect(() => { setLinkURL(node.url); }, [node]);

  const onLinkURLChange = useCallback(
    (event) => setLinkURL(event.target.value),
    [setLinkURL]
  );

  const onApply = useCallback(
    (event) => {
      Transforms.setNodes(editor, { url: linkURL }, { at: path });
    }, [editor, linkURL. path]
  )

  useEffect(() => {
    const linkEditorEl = linkEditorRef.current;
    if (linkEditorEl == null) return;

    const linkDOMNode = ReactEditor.toDOMNode(editor, node);
    const {
      x: nodeX,
      height: nodeHeight,
      y: nodeY
    } = linkDOMNode.getBoundingClientRect();

    linkEditorEl.style.display = 'block';
    linkEditorEl.style.top = `${nodeY + nodeHeight - editorOffsets.y}px`;
    linkEditorEl.style.left = `${nodeX - editorOffsets.x}px`;
  }, [editor, editorOffsets.x, editorOffsets.y, node]);

  if (editorOffsets == null) return null;

  return (
    <div ref={linkEditorRef} className="link-editor">
      <div className='link-editor-body'>
        <Input defaultValue={linkURL} onChange={onLinkURLChange} />
        <Button type="primary" onClick={onApply} disabled={!isUrl(linkURL)}>
          Apply
        </Button>
      </div>
    </div>
  );
}

export default LinkEditor;
