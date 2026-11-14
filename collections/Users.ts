import { APIError, type CollectionConfig } from 'payload'

import { administratorOrSelf, administrators, isAdministrator, isApprovedStaff } from '../lib/staffAccess'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    description: 'Administrators create approved staff accounts. Public registration is disabled.',
  },
  auth: true,
  access: {
    admin: ({ req }) => isApprovedStaff(req.user),
    create: administrators,
    read: administratorOrSelf,
    update: administratorOrSelf,
    delete: administrators,
    unlock: administrators,
  },
  hooks: {
    beforeChange: [({ data, operation, req }) => {
      // Payload's /first-register bypasses create access. A hook is required to close it.
      // This context is server-only; it cannot be set through a REST/GraphQL request body.
      if (operation === 'create' && !isAdministrator(req.user) && req.context.staffBootstrap !== true) {
        throw new APIError('Only administrators can create staff accounts.', 403)
      }
      return data
    }],
    beforeLogin: [({ user }) => {
      if (!isApprovedStaff({ ...user, collection: 'users' })) {
        throw new APIError('This account has not been approved. Contact a site administrator.', 403)
      }
      return user
    }],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Display name' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending / Disabled', value: 'pending' },
        { label: 'Editor', value: 'editor' },
        { label: 'Administrator', value: 'admin' },
      ],
      access: {
        create: ({ req }) => isAdministrator(req.user) || req.context.staffBootstrap === true,
        update: ({ req }) => isAdministrator(req.user) || req.context.staffBootstrap === true,
      },
      admin: {
        description: 'Editors manage content. Administrators also manage staff accounts. Pending accounts have no staff access.',
      },
    },
  ],
}
