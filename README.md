# Release And Tag After Merge Action

This Github Action tags and releases after a pull request is merged.

```
"master"-------------M----------
                    /
"release/1.0.0"----/
```

## IMPORTANT!

Needs the merge message to stay default (Example: _"Merge pull request #1 from some-repo"_)

## Inputs

### `token`

**REQUIRED** A Github token, usually ${{ secrets.GITHUB_TOKEN }}.

### `release-branch-format`

The regex format of the release branch, after this string should be the tag name used.
Default `release\/`. (example branch names: release/1.0.0 or feature/1234@release/1.0.0)

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
      - uses: planet-code/release-tag-action@1.1.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          release-branch-format: "release\/"
          show-changelog: true
```
