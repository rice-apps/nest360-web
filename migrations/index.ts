import * as migration_20261031_200146_initial from './20261031_200146_initial';

export const migrations = [
  {
    up: migration_20261031_200146_initial.up,
    down: migration_20261031_200146_initial.down,
    name: '20261031_200146_initial'
  },
];
