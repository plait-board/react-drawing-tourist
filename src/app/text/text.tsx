import { useMemo } from "react";
import { Editor, createEditor, Element } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

export type TextProps = {
  value: Element;
  readOnly?: boolean;
  onChange?: (event: Editor) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const Text = (props: TextProps) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const initialValue = useMemo(() => [props.value], [props.value]);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable className="text-container" readOnly={true} placeholder="" />
    </Slate>
  );
};
