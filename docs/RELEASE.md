# Release Process

This package is released through a hardened, tokenless pipeline:
[release-please](https://github.com/googleapis/release-please) for versioning,
[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC) for authentication, and
[staged publishing](https://docs.npmjs.com/staged-publishing/) for the final approval gate.
**No long-lived npm tokens exist locally or in CI.** Never run `npm publish` locally.

## Day-to-day development

- Use Conventional Commits. When releasable commits (`fix:`, `feat:`, breaking changes)
  land on `main`, release-please automatically creates or updates a release PR
  titled `chore(main): release X.Y.Z`.
- The version is derived from commits: `fix:` → patch, `feat:` → minor,
  `feat!:` / `BREAKING CHANGE:` → major. To force a specific version, add a
  `Release-As: x.y.z` footer to a commit (an empty commit works):

  ```bash
  git commit --allow-empty -m "chore: release" -m "Release-As: 4.0.4"
  ```

## Releasing

1. **Review and merge the release PR** (version bump + CHANGELOG).
   Note: CI does not run on release PRs (a GITHUB_TOKEN limitation) — this is
   acceptable because the publish job rebuilds and tests everything before publishing.
2. **Approve the `npm` environment deployment** (Actions → the waiting Release run → Review deployments).
3. The publish job rebuilds `dist/` from scratch (`npm run rebuild`) and runs
   `npm stage publish`. release-please creates the GitHub Release and tag.
   The package is now *staged* on npm — not yet public.
4. **Inspect and approve the staged package** (requires 2FA):

   ```bash
   npm stage list extract-git-treeish
   npm stage view <stage-id>
   npm stage download <stage-id>   # optional: inspect the tarball
   npm stage approve <stage-id>
   ```

   CLI access requires `npm login` first (a 2-hour session; long-lived tokens
   no longer exist). Alternatively, approve on npmjs.com → Staged Packages.
5. **Verify**: the provenance section appears on the npm package page, and
   `npm audit signatures` reports a verified attestation in a consumer project.

## Recovery

- **Publish job failed after the GitHub Release was created**: fix the workflow
  on `main`, then re-run via Actions → Release → Run workflow (`workflow_dispatch`).
  Re-running the failed job would reuse the old workflow definition, so use the
  manual dispatch instead.
- **Bad staged package**: `npm stage reject <stage-id>`. The GitHub Release and
  tag already exist and are immutable — accept the version gap and release the
  next number.
- **Published by mistake**: `npm unpublish` within 72 hours, `npm deprecate` after that.

## Configuration map

| Where | What |
|-------|------|
| `.github/workflows/release.yml` | release-please job + publish job (environment `npm`, OIDC, `npm stage publish`) |
| `release-please-config.json` / `.release-please-manifest.json` | release-please manifest-mode configuration (`include-component-in-tag: false` keeps `vX.Y.Z` tags) |
| npm package settings | Trusted Publisher: repo `twada/extract-git-treeish`, workflow `release.yml`, environment `npm`, allowed action `npm stage publish` only. Publishing access: 2FA required, tokens disallowed |
| GitHub repo settings | Environment `npm` (required reviewer, deployment branch `main`), immutable releases enabled, read-only default workflow permissions |
