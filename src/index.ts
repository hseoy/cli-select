import SelectOptions from './select-options';
import Renderer, { RenderOptions } from './renderer';
import KeyInput from './key-input';

export type CliSelectOptions = Omit<RenderOptions, 'selectedValue'> & {
  cleanup?: boolean;
  inputStream?: NodeJS.ReadStream;
  outputStream?: NodeJS.WritableStream;
};

const cliSelect = (options: CliSelectOptions) => {
  const { values, valueRenderer, indentationCnt, inputStream, outputStream } =
    options;

  const keyInput = new KeyInput(inputStream);
  const renderer = new Renderer(outputStream);
  const selectOptions = new SelectOptions([...values]);

  const defaultRenderOptions: RenderOptions = {
    values,
    valueRenderer,
    indentationCnt,
    selectedValue: selectOptions.getSelectedOptionIndex(),
  };

  renderer.render(defaultRenderOptions);

  const cleanup = () => {
    keyInput.close();
    if (options.cleanup) {
      renderer.cleanup();
    }
  };

  return new Promise<{ value: string; id: number } | null>(resolve => {
    keyInput.open();
    keyInput.setArrowInputListener('up', selectOptions.selectPrevOption);
    keyInput.setArrowInputListener('down', selectOptions.selectNextOption);
    keyInput.setEnterInputListener(() => {
      cleanup();
      resolve({
        value: selectOptions.getSelectedOption(),
        id: selectOptions.getSelectedOptionIndex(),
      });
    });
    keyInput.setCancelInputListener(() => {
      cleanup();
      resolve(null);
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
