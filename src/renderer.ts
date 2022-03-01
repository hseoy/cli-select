import ansiEscapes from 'ansi-escapes';

export type RenderOptions = {
  values: string[];
  valueRenderer?: (value: string, selected: boolean) => string;
  selectedValue?: number;
  selected?: string;
  unselected?: string;
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
    valueRenderer,
    selectedValue = 0,
    selected = '(x)',
    unselected = '( )',
    indentationCnt = 0,
  }: RenderOptions) {
    this.values = values;
    values.forEach((value, index) => {
      const selectSymbol = selectedValue === index ? selected : unselected;
      const indentation = ' '.repeat(indentationCnt);
      const renderedValue = valueRenderer
        ? valueRenderer(value, selectedValue === index)
        : value;
      const end = index !== this.values.length - 1 ? '\n' : '';

      this.stream.write(`${indentation + selectSymbol} ${renderedValue}${end}`);
    });
  }

  cleanup() {
    this.stream.write(ansiEscapes.eraseLines(this.values.length));
    this.stream.write(ansiEscapes.cursorShow);
  }
}

export default Renderer;
