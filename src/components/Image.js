import { useState, useCallback } from 'react';
import { Editor, Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import { Input } from 'antd'
import isHotkey from 'is-hotkey';

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [caption, setCaption] = useState(element.caption);

  const applyCaptionChange = useCallback(
    (captionInput) => {
      const imageNodeEntry = Editor.above(
        editor,
        {
          match: (n) => n.type === 'image'
        }
      )

      if (imageNodeEntry == null) return;
      if (captionInput != null) setCaption(captionInput);

      Transforms.setNodes(
        editor,
        { caption: captionInput },
        { at: imageNodeEntry[1] }
      );
    },
    [editor, setCaption]
  );

  const onCaptionChange = useCallback(
    (event) => {
      setCaption(event.target.value);
    },
    [editor.selection, setCaption]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (!isHotkey('enter', event)) return;

      applyCaptionChange(event.target.value);
      setIsEditingCaption(false);
    },
    [applyCaptionChange, setIsEditingCaption]
  );

  const onToggleCaptionEditMode = useCallback(
    (event) => {
      const wasEditing = isEditingCaption;
      setIsEditingCaption(!isEditingCaption);
      wasEditing && applyCaptionChange(caption);
    },
    [editor.selection, isEditingCaption, applyCaptionChange, caption]
  )

  const CaptionInput = () => (
    isEditingCaption ? (
      <Input
        autoFocus={true}
        className={"image-caption-input"}
        size="small"
        defaultValue={caption}
        onKeyDown={onKeyDown}
        onChange={onCaptionChange}
        onBlur={onToggleCaptionEditMode}
      />
    ) : (
      <div
        className={"image-caption-read-mode"}
        onClick={onToggleCaptionEditMode}
      >
        {caption}
      </div>
    )
  );

  return (
    <div contentEditable={false} {...attributes}>
      <div className='image-container'>
        <img
          src={String(element.url)}
          alt={element.caption}
          className={"image"}
        />

        <CaptionInput />
      </div>
      {children}
    </div>
  );
}

export default Image;
