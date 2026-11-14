# Staff accounts

Staff sign in with their existing email and password. Names are display labels, not login credentials.
Public registration (including Payload's first-account endpoint) is disabled.

## Roles

- **Pending / Disabled:** cannot log in, enter the admin, preview drafts, or change content.
- **Editor:** manages content and their own profile/password; cannot manage other accounts or change roles.
- **Administrator:** also creates, approves, disables, and manages staff accounts.

New accounts default to pending. An administrator explicitly chooses Editor or Administrator when
creating an approved account. Existing accounts become pending during migration; no existing account
is automatically trusted or promoted. Do not deploy without planning the setup below.

## Initial setup and rollout

1. Choose the approved initial administrator with the client. No email is hardcoded in the repository.
2. Back up the target database and arrange a maintenance window. Apply the database migration before
   serving the new code. On PostgreSQL, use the project's normal `npm run payload migrate` process.
3. In a trusted terminal with the **target deployment's environment** loaded, run:

   ```sh
   export STAFF_ADMIN_EMAIL='approved-person@example.org'
   export STAFF_ADMIN_CONFIRM=yes
   npm run staff:setup-admin
   unset STAFF_ADMIN_EMAIL STAFF_ADMIN_CONFIRM
   ```

   This approves an existing account without changing its password. For a new account, also set
   `STAFF_ADMIN_NAME` and `STAFF_ADMIN_PASSWORD` (at least 12 characters). Enter the password via your
   secret manager or a hidden terminal prompt, never commit it or put it in shell history. Unset it
   after the command. PostgreSQL setup requires the production PAYLOAD_SECRET; it will not silently
   fall back to SQLite if the configured database cannot be reached.

4. Verify administrator login, then review and explicitly approve known staff as Editors under Users.
   Review unexpected existing accounts instead of approving the whole user table.
5. Verify an Editor can publish content but cannot create users, change roles, or edit another account.
   Verify signed-out requests cannot create users at `/api/users` or `/api/users/first-register`.

On an empty local SQLite database, run the same setup command with a local administrator and a new
password. The public first-account screen cannot bootstrap an account anymore.

## Day-to-day management

Administrators add approved staff under Users, choose a role and set an initial password. Share that
password through an approved secure channel; staff can change their own password. Email delivery and
invitation links are not implemented by this change. Recovery emails need a separately configured mail
provider. Set a role to Pending / Disabled to revoke staff permissions, including for existing sessions.

Keep at least one administrator. If all administrators are disabled, deleted, or unavailable, a trusted
operator can run the setup command again to recover access. It is a server-side recovery tool, not a
public registration endpoint. Never expose it as an HTTP route.

## Development and verification

`PAYLOAD_AUTOLOGIN_EMAIL` remains development-only; it does not grant pending accounts staff access.
The access integration test uses its own disposable SQLite database and never uses the
application's database or storage configuration:

```sh
npm run test:staff-access
```
