import SelectOptions from './select-options';
import Renderer, { ValueRendererFunction } from './renderer';
import KeyInput from './key-input';

export type CliSelectOptions = {
  values: string[];
  valueRenderer?: ValueRendererFunction;
  indentationCnt?: number;
  cleanup?: boolean;
  inputStream?: NodeJS.ReadStream;
  outputStream?: NodeJS.WritableStream;
};

const cliSelect = (options: CliSelectOptions) => {
  const {
    values,
    inputStream,
    outputStream,
    cleanup: isEraseLines,
    ...otherRenderOptions
  } = options;

  const keyInput = new KeyInput(inputStream);
  const selectOptions = new SelectOptions([...values]);
  const renderer = new Renderer(
    { ...otherRenderOptions, isEraseLines, selectOptions },
    outputStream,
  );

  const selectCleanup = () => {
    keyInput.close();
    renderer.cleanup();
  };

  renderer.render();

  return new Promise<{ value: string; id: number } | null>(resolve => {
    selectOptions.setSelectedOptionChangeListener(renderer.render);
    keyInput.open();
    keyInput.setArrowInputListener('up', selectOptions.selectPrevOption);
    keyInput.setArrowInputListener('down', selectOptions.selectNextOption);

    keyInput.setEnterInputListener(() => {
      selectCleanup();
      resolve({
        value: selectOptions.getSelectedOption(),
        id: selectOptions.getSelectedOptionIndex(),
      });
    });
    keyInput.setCancelInputListener(() => {
      selectCleanup();
      resolve(null);
    });
  });
};

export default cliSelect;
