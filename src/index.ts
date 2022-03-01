import Renderer, { RenderOptions } from './renderer';
import KeyInput from './key-input';

export type CliSelectOptions = Omit<RenderOptions, 'selectedValue'> & {
  cleanup?: boolean;
  inputStream?: NodeJS.ReadStream;
  outputStream?: NodeJS.WritableStream;
};

const isUpDownKey = (key: string): key is 'up' | 'down' => {
  return key === 'up' || key === 'down';
};

const cliSelect = (options: CliSelectOptions) => {
  const keyInput = new KeyInput(options.inputStream);
  const renderer = new Renderer(options.outputStream);

  const { values, valueRenderer, indentationCnt } = options;
  const defaultRenderOptions: RenderOptions = {
    values,
    valueRenderer,
    indentationCnt,
    selectedValue: 0,
  };

  renderer.render(defaultRenderOptions);

  let selectedValue = 0;
  let beforeSelectedValue = 0;

  const keyHandlerMap: Record<'up' | 'down', () => number> = {
    up: () => (selectedValue - 1 >= 0 ? selectedValue - 1 : 0),
    down: () =>
      selectedValue + 1 < values.length ? selectedValue + 1 : values.length - 1,
  };

  return new Promise(resolve => {
    keyInput.open();
    keyInput.setInputListener(key => {
      const keyName = key.name ?? '';
      if (isUpDownKey(keyName)) {
        beforeSelectedValue = selectedValue;
        selectedValue = keyHandlerMap[keyName]();
      } else if (
        key.name === 'return' ||
        key.name === 'escape' ||
        (key.name === 'c' && key.ctrl)
      ) {
        if (options.cleanup) {
          renderer.cleanup();
        }
        resolve(
          key.name !== 'return'
            ? null
            : { value: values[selectedValue], id: selectedValue },
        );
        return;
      }

      if (beforeSelectedValue !== selectedValue) {
        renderer.render({ ...defaultRenderOptions, selectedValue });
      }
    });
  });
};

export default cliSelect;
