import * as migration_20261024_220542_initial from './20261024_220542_initial';
import * as migration_20261031_184231_add_initial_collection_fields from './20261031_184231_add_initial_collection_fields';
import * as migration_20261031_202836_add_resources_and_project_category from './20261031_202836_add_resources_and_project_category';

export const migrations = [
  {
    up: migration_20261024_220542_initial.up,
    down: migration_20261024_220542_initial.down,
    name: '20261024_220542_initial',
  },
  {
    up: migration_20261031_184231_add_initial_collection_fields.up,
    down: migration_20261031_184231_add_initial_collection_fields.down,
    name: '20261031_184231_add_initial_collection_fields',
  },
  {
    up: migration_20261031_202836_add_resources_and_project_category.up,
    down: migration_20261031_202836_add_resources_and_project_category.down,
    name: '20261031_202836_add_resources_and_project_category'
  },
];
