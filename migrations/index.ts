import * as migration_20261024_220542_initial from './20261024_220542_initial';
import * as migration_20261031_201512 from './20261031_201512';

export const migrations = [
  {
    up: migration_20261024_220542_initial.up,
    down: migration_20261024_220542_initial.down,
    name: '20261024_220542_initial',
  },
  {
    up: migration_20261031_201512.up,
    down: migration_20261031_201512.down,
    name: '20261031_201512'
  },
];
