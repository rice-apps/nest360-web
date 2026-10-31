import * as migration_20261024_220542_initial from './20261024_220542_initial';

export const migrations = [
  {
    up: migration_20261024_220542_initial.up,
    down: migration_20261024_220542_initial.down,
    name: '20261024_220542_initial'
  },
];
