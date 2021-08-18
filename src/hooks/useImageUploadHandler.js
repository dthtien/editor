import { v4 as uuidv4 } from "uuid";
import { useCallback } from 'react';
import { Transforms } from "slate";

export default function useImageUploadHandler(editor, previousSelection) {
  return useCallback(
    (event) => {
      event.preventDefault();

      const files = event.target.files;
      if (files.length === 0) return;
      const file = files[0];
      const fileName = file.name;
      const formData = new FormData();
      formData.append('photo', file);

      const id = uuidv4();
      Transforms.insertNodes(
        editor,
        {
          id,
          type: "image",
          caption: fileName,
          url: null,
          isUploading: true,
          children: [{ text: "" }],
        },
        { at: previousSelection, select: true }
      );
    },
    [editor, previousSelection]
  )
}
