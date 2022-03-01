import readline, { Key } from 'readline';

class KeyInput {
  private stream: NodeJS.ReadStream;

  private listener: (key: Key) => void;

  constructor(stream = process.stdin) {
    this.stream = stream;
    this.listener = () => {};
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  setInputListener(listener: (data: Key) => void) {
    this.listener = listener;
  }

  open() {
    readline.emitKeypressEvents(this.stream);

    this.stream.on('keypress', this.onKeyPress);

    this.stream.setRawMode(true);
    this.stream.resume();
  }

  close() {
    this.stream.setRawMode(false);
    this.stream.pause();

    this.stream.removeListener('keypress', this.onKeyPress);
  }

  private onKeyPress(_string: string, key: Key) {
    this.listener(key);
  }
}

export default KeyInput;
