import KeyInput from './key-input';

const cliSelect = () => {
  const input = new KeyInput(process.stdin);
  input.open();

  return new Promise(resolve => {
    input.open();
    input.setInputListener(data => {
      input.close();
      return resolve(data);
    });
  });
};

export default cliSelect;
