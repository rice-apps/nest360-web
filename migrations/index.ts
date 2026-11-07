import * as migration_20261031_201851_initial from './20261031_201851_initial';
import * as migration_20261107_000000_add_project_category from './20261107_000000_add_project_category';

export const migrations = [
  {
    up: migration_20261031_201851_initial.up,
    down: migration_20261031_201851_initial.down,
    name: '20261031_201851_initial'
  },
  {
    up: migration_20261107_000000_add_project_category.up,
    down: migration_20261107_000000_add_project_category.down,
    name: '20261107_000000_add_project_category'
  },
];
