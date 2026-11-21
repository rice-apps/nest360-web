import * as migration_20261031_201851_initial from './20261031_201851_initial';
import * as migration_20261031_202836_add_resources_and_project_category from './20261031_202836_add_resources_and_project_category';
import * as migration_20261107_000000_add_project_category from './20261107_000000_add_project_category';
import * as migration_20261108_205048 from './20261108_205048';
import * as migration_20261108_212241_add_header from './20261108_212241_add_header';
import * as migration_20261114_000000_staff_access from './20261114_000000_staff_access';
import * as migration_20261114_182046 from './20261114_182046';
import * as migration_20261114_193036_add_authors from './20261114_193036_add_authors';
import * as migration_20261114_194911_media_collections from './20261114_194911_media_collections';
import * as migration_20261114_213631_project_page_cleanup from './20261114_213631_project_page_cleanup';
import * as migration_20261121_194459 from './20261121_194459';

export const migrations = [
  {
    up: migration_20261031_201851_initial.up,
    down: migration_20261031_201851_initial.down,
    name: '20261031_201851_initial',
  },
  {
    up: migration_20261031_202836_add_resources_and_project_category.up,
    down: migration_20261031_202836_add_resources_and_project_category.down,
    name: '20261031_202836_add_resources_and_project_category',
  },
  {
    up: migration_20261107_000000_add_project_category.up,
    down: migration_20261107_000000_add_project_category.down,
    name: '20261107_000000_add_project_category',
  },
  {
    up: migration_20261108_205048.up,
    down: migration_20261108_205048.down,
    name: '20261108_205048',
  },
  {
    up: migration_20261108_212241_add_header.up,
    down: migration_20261108_212241_add_header.down,
    name: '20261108_212241_add_header',
  },
  {
    up: migration_20261114_000000_staff_access.up,
    down: migration_20261114_000000_staff_access.down,
    name: '20261114_000000_staff_access',
  },
  {
    up: migration_20261114_182046.up,
    down: migration_20261114_182046.down,
    name: '20261114_182046',
  },
  {
    up: migration_20261114_193036_add_authors.up,
    down: migration_20261114_193036_add_authors.down,
    name: '20261114_193036_add_authors',
  },
  {
    up: migration_20261114_194911_media_collections.up,
    down: migration_20261114_194911_media_collections.down,
    name: '20261114_194911_media_collections',
  },
  {
    up: migration_20261114_213631_project_page_cleanup.up,
    down: migration_20261114_213631_project_page_cleanup.down,
    name: '20261114_213631_project_page_cleanup',
  },
  {
    up: migration_20261121_194459.up,
    down: migration_20261121_194459.down,
    name: '20261121_194459'
  },
];
