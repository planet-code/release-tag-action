# Release Tag After Merge Action

This Github Action tags and releases after a pull request is merged.

```
"master"-------------M----------
                    /
"release/1.0.0"----/
```

## Inputs

### `token`

**REQUIRED** A Github token, usually ${{ github.token }}.

### `release-branch-prefix`

The prefix of the release branch. Default `release/`. (example branch name: release/1.0.0)

### `show-changelog`

To show the title and body of the pull request as the changelog (body) of the release. Default `true`.

## Outputs

### `tag`

The tag name

## Example usage

```yaml
name: Release tag

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/release-tag-action@1.0.0
```
