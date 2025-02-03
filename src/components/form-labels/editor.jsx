import React, { useState } from "react";
import fs from "../form/Form.module.scss";
import { Editor } from "@tinymce/tinymce-react";

const editorData = {
  apiKey: "bwner81a1px3xilbh7mfoc03mrcfcnrv9hjkwdww9jfjh9qh",
  bar: " blocks forecolor | bold italic bullist numlist | alignleft aligncenter alignright | link quickimage media | outdent indent | removeformat underline | undo redo preview code fullscreen ",
  plugin:
    "quickbars preview importcss autolink autosave save directionality code fullscreen image link media codesample table pagebreak advlist lists wordcount",
};

export default function EditorLabel({ label, invalid, change, def }) {
  const { name, placeholder } = label;

  const onChange = (value) => {
    change({ target: { name: name, value: value } });
  };

  return (
    <div className={`${fs.editor} ${invalid[name] ? fs.error : null}`}>
      <Editor
        value={def[name]}
        apiKey={editorData.apiKey}
        textareaName={name}
        init={{
          placeholder: placeholder,
          height: 700,
          menubar: false,
          branding: false,
          toolbar: editorData.bar,
          block_unsupported_drop: false,
          toolbar_mode: "wrap",
          plugins: editorData.plugin,
          quickbars_insert_toolbar: false,
        }}
        onEditorChange={onChange}
      />
    </div>
  );
}
