import * as React from 'react';

type Padding<T> = T | { top?: T; right?: T; bottom?: T; left?: T };

type Props = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'onInput' | 'style' | 'value'
> & {
  highlight?: (value: string) => string | React.ReactNode;
  ignoreTabKey?: boolean;
  insertSpaces?: boolean;
  onValueChange: (value: string) => void;
  padding?: Padding<number | string>;
  style?: React.CSSProperties;
  tabSize?: number;
  value: string;
  textareaClassName?: string;
  textareaId?: string;
  preClassName?: string;
};

const getPaddingStyle = (padding: Props['padding']): React.CSSProperties => {
  if (typeof padding === 'object') {
    return {
      paddingTop: padding.top,
      paddingRight: padding.right,
      paddingBottom: padding.bottom,
      paddingLeft: padding.left,
    };
  }

  return { padding };
};

const Editor = React.forwardRef<HTMLTextAreaElement, Props>(function Editor(
  props,
  ref,
) {
  const {
    highlight,
    ignoreTabKey,
    insertSpaces,
    onValueChange,
    onClick,
    onKeyDown,
    onMouseDown,
    padding = 0,
    preClassName,
    style,
    tabSize = 2,
    textareaClassName,
    textareaId,
    value,
    ...textareaProps
  } = props;

  void highlight;
  void ignoreTabKey;
  void insertSpaces;
  void preClassName;

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    onValueChange(event.currentTarget.value);
  };

  const handleClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    onClick?.(event);
    event.stopPropagation();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event);
    event.stopPropagation();
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    onMouseDown?.(event);
    event.stopPropagation();
  };

  return (
    <textarea
      {...textareaProps}
      ref={ref}
      id={textareaId}
      className={textareaClassName}
      value={value}
      {...({ oninput: handleInput } as Record<
        string,
        React.FormEventHandler<HTMLTextAreaElement>
      >)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      data-gramm={false}
      style={{
        ...styles.textarea,
        ...getPaddingStyle(padding),
        tabSize,
        ...style,
      }}
    />
  );
});

const styles = {
  textarea: {
    background: '#fffdf8',
    border: 0,
    boxSizing: 'border-box',
    color: '#1b1b18',
    cursor: 'text',
    display: 'block',
    height: '100%',
    margin: 0,
    minHeight: 0,
    outline: 'none',
    resize: 'none',
    width: '100%',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  },
} satisfies Record<string, React.CSSProperties>;

export default Editor;
