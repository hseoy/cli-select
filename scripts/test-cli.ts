import cliSelect from '../src/index';

const main = async () => {
  const value = await cliSelect({ values: ['TEST1', 'TEST2'], cleanup: true });
  console.log(value);
};

main().catch(e => console.log(e));
