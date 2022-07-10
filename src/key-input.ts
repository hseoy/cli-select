import readline, { Key } from 'readline';

type ArrowKeyName = 'up' | 'down' | 'right' | 'left';

const isArrowKeyName = (keyName: string): keyName is ArrowKeyName => {
  return (
    keyName === 'up' ||
    keyName === 'down' ||
    keyName === 'right' ||
    keyName === 'left'
  );
};

class KeyInput {
  private stream: NodeJS.ReadStream;

  private inputListener: (key: Key) => void;

  private enterInputListener: (key: Key) => void;

  private cancelInputListener: (key: Key) => void;

  private arrowKeyListeners: Record<ArrowKeyName, (key: Key) => void>;

  constructor(stream: NodeJS.ReadStream = process.stdin) {
    this.stream = stream;
    this.onKeyPress = this.onKeyPress.bind(this);
    this.inputListener = () => null;
    this.enterInputListener = () => null;
    this.cancelInputListener = () => null;
    this.arrowKeyListeners = {
      up: () => null,
      down: () => null,
      right: () => null,
      left: () => null,
    };
  }

  public setInputListener(listener: (data: Key) => void) {
    this.inputListener = listener;
  }

  public setEnterInputListener(listener: (data: Key) => void) {
    this.enterInputListener = listener;
  }

  public setCancelInputListener(listener: (data: Key) => void) {
    this.cancelInputListener = listener;
  }

  public setArrowInputListener(
    arrowKeyName: ArrowKeyName,
    listener: (data: Key) => void,
  ) {
    this.arrowKeyListeners = {
      ...this.arrowKeyListeners,
      [arrowKeyName]: listener,
    };
  }

  public open() {
    readline.emitKeypressEvents(this.stream);

    this.stream.on('keypress', this.onKeyPress);

    this.stream.setRawMode(true);
    this.stream.resume();
  }

  public close() {
    this.stream.setRawMode(false);
    this.stream.pause();

    this.stream.removeListener('keypress', this.onKeyPress);
  }

  private onKeyPress(_string: string, key: Key) {
    if (key.name && isArrowKeyName(key.name)) {
      this.arrowKeyListeners[key.name](key);
    } else if (key.name === 'return') {
      this.enterInputListener(key);
    } else if (key.name === 'escape' || (key.name === 'c' && key.ctrl)) {
      this.cancelInputListener(key);
    }

    this.inputListener(key);
  }
}

export default KeyInput;
