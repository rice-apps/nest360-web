import * as migration_20261031_201851_initial from './20261031_201851_initial';

export const migrations = [
  {
    up: migration_20261031_201851_initial.up,
    down: migration_20261031_201851_initial.down,
    name: '20261031_201851_initial'
  },
];
