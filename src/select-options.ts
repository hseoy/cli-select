type SelectOptionsListenerFunction<T> = (args: {
  option: T;
  optionIndex: number;
}) => void;

class SelectOptions<T> {
  private beforeSelectedOptionIndex: number;

  private selectedOptionIndex: number;

  private options: T[];

  private selectedOptionChangeListener: SelectOptionsListenerFunction<T>;

  constructor(options: T[]) {
    this.beforeSelectedOptionIndex = 0;
    this.selectedOptionIndex = 0;
    this.options = options;
    this.selectedOptionChangeListener = () => null;

    this.selectNextOption = this.selectNextOption.bind(this);
    this.selectPrevOption = this.selectPrevOption.bind(this);
  }

  private getMaxOptionIndex() {
    return this.options.length - 1;
  }

  public getOptions() {
    return this.options;
  }

  public getSelectedOption() {
    return this.options[this.selectedOptionIndex];
  }

  public getSelectedOptionIndex() {
    return this.selectedOptionIndex;
  }

  public selectNextOption() {
    const isMax = this.selectedOptionIndex + 1 >= this.options.length;

    this.beforeSelectedOptionIndex = this.selectedOptionIndex;
    this.selectedOptionIndex = isMax
      ? this.getMaxOptionIndex()
      : this.selectedOptionIndex + 1;

    this.callListenerWhenHasSelectedOptionChanged();
  }

  public selectPrevOption() {
    const minOptionIndex = 0;
    const isMin = this.selectedOptionIndex - 1 < 0;

    this.beforeSelectedOptionIndex = this.selectedOptionIndex;
    this.selectedOptionIndex = isMin
      ? minOptionIndex
      : this.selectedOptionIndex - 1;

    this.callListenerWhenHasSelectedOptionChanged();
  }

  public hasSelectedOptionChanged() {
    return this.beforeSelectedOptionIndex !== this.selectedOptionIndex;
  }

  public setSelectedOptionChangeListener(
    listener: SelectOptionsListenerFunction<T>,
  ) {
    this.selectedOptionChangeListener = listener;
  }

  private callListenerWhenHasSelectedOptionChanged() {
    if (this.hasSelectedOptionChanged()) {
      this.selectedOptionChangeListener({
        option: this.getSelectedOption(),
        optionIndex: this.getSelectedOptionIndex(),
      });
    }
  }
}

export default SelectOptions;
