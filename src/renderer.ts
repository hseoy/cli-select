import SelectOptions from './select-options';
import { eraseLines, cursorShow, cursorHide } from './library/ansi-escapes';

export type ValueRendererFunction = (
  value: string,
  selected: boolean,
) => { symbol: string; value: string };

export const defaultValueRenderer = (value: string, selected: boolean) => ({
  value,
  symbol: selected ? '(x)' : '( )',
});

export type RenderOptions = {
  valueRenderer?: ValueRendererFunction;
  indentationCnt?: number;
  isEraseLines?: boolean;
  selectOptions: SelectOptions<string>;
};

class Renderer {
  private stream: NodeJS.WritableStream;

  private values: readonly string[];

  private renderOptions: RenderOptions;

  private isInitialRendering: boolean;

  constructor(
    renderOptions: RenderOptions,
    stream: NodeJS.WritableStream = process.stdout,
  ) {
    this.stream = stream;
    this.values = renderOptions.selectOptions.getOptions();
    this.renderOptions = renderOptions;
    this.isInitialRendering = true;
    this.render = this.render.bind(this);
  }

  public init() {
    this.stream.write(cursorHide);
  }

  public render() {
    const {
      selectOptions,
      indentationCnt = 0,
      valueRenderer = defaultValueRenderer,
      isEraseLines,
    } = this.renderOptions;
    const selectedOptionIndex = selectOptions.getSelectedOptionIndex();

    if (!this.isInitialRendering && isEraseLines) {
      this.eraseLines();
    }

    if (this.isInitialRendering) {
      this.isInitialRendering = false;
    }

    this.values.forEach((option, index) => {
      const indentation = ' '.repeat(indentationCnt);
      const isSelected = selectedOptionIndex === index;
      const renderedValue = valueRenderer(option, isSelected);
      const end = index !== this.values.length - 1 ? '\n' : '';

      this.stream.write(
        `${indentation + renderedValue.symbol} ${renderedValue.value}${end}`,
      );
    });
  }

  public cleanup() {
    if (this.renderOptions.isEraseLines) {
      this.eraseLines();
    }
    this.stream.write(cursorShow);
  }

  private eraseLines() {
    this.stream.write(eraseLines(this.values.length));
  }
}

export default Renderer;
