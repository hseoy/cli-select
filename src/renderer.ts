import ansiEscapes from './ansi-escapes';

const defaultValueRenderer = (value: string, selected: boolean) => ({
  value,
  symbol: selected ? '(x)' : '( )',
});

export type RenderOptions = {
  values: string[];
  valueRenderer?: (
    value: string,
    selected: boolean,
  ) => { symbol: string; value: string };
  selectedValue?: number;
  indentationCnt?: number;
};

class Renderer {
  private stream: NodeJS.WritableStream;

  private values: string[];

  constructor(stream: NodeJS.WritableStream = process.stdout) {
    this.stream = stream;
    this.values = [];
  }

  init() {
    this.stream.write(ansiEscapes.cursorHide);
  }

  render({
    values,
    valueRenderer = defaultValueRenderer,
    selectedValue = 0,
    indentationCnt = 0,
  }: RenderOptions) {
    this.values = values;
    values.forEach((value, index) => {
      const indentation = ' '.repeat(indentationCnt);
      const renderedValue = valueRenderer(value, selectedValue === index);
      const end = index !== this.values.length - 1 ? '\n' : '';

      this.stream.write(
        `${indentation + renderedValue.symbol} ${renderedValue.value}${end}`,
      );
    });
  }

  cleanup() {
    this.stream.write(ansiEscapes.eraseLines(this.values.length));
    this.stream.write(ansiEscapes.cursorShow);
  }
}

export default Renderer;
