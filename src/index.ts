import SelectOptions from './select-options';
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
  const { values, valueRenderer, indentationCnt, inputStream, outputStream } =
    options;

  const keyInput = new KeyInput(inputStream);
  const renderer = new Renderer(outputStream);
  const selectOptions = new SelectOptions(values);

  const defaultRenderOptions: RenderOptions = {
    values,
    valueRenderer,
    indentationCnt,
    selectedValue: selectOptions.getSelectedOptionIndex(),
  };

  renderer.render(defaultRenderOptions);

  const keyHandlerMap: Record<'up' | 'down', () => void> = {
    up: () => selectOptions.selectPrevOption(),
    down: () => selectOptions.selectNextOption(),
  };

  return new Promise<{ value: string; id: number } | null>(resolve => {
    keyInput.open();
    keyInput.setInputListener(key => {
      if (key.name && isUpDownKey(key.name)) {
        keyHandlerMap[key.name]();
        return;
      }
      if (
        key.name === 'return' ||
        key.name === 'escape' ||
        (key.name === 'c' && key.ctrl)
      ) {
        keyInput.close();
        renderer.cleanup();
        const selectedOptionIndex = selectOptions.getSelectedOptionIndex();
        resolve(
          key.name !== 'return'
            ? null
            : { value: values[selectedOptionIndex], id: selectedOptionIndex },
        );
      }
    });
    selectOptions.setSelectedOptionChangeListener(({ optionIndex }) => {
      if (options.cleanup) {
        renderer.cleanup();
      }
      renderer.render({ ...defaultRenderOptions, selectedValue: optionIndex });
    });
  });
};

export default cliSelect;
