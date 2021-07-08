const core = require("@actions/core");
const github = require("@actions/github");

run();

async function run() {
  try {
    await action();
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function action() {
  const githubToken = core.getInput("token");
  const octokit = github.getOctokit(githubToken);
  const tag = getTag();

  await createTag(tag, octokit);
  await createRelease(tag, octokit);

  core.setOutput("tag", tag);
}

function getTag() {
  const releaseBranchPattern = core.getInput("release-branch-pattern");
  const releaseBranchName = getReleaseBranchName();

  if (
    releaseBranchPattern.length > 0 &&
    !releaseBranchName.match(releaseBranchPattern)
  )
    throw new Error(
      `Branch name doesn't contain the correct pattern. releaseBranchName={${releaseBranchName}};releaseBranchPattern={${releaseBranchPattern}}`
    );

  var branchElements = releaseBranchName.split(pattern);
  return branchElements[branchElements.length - 1];
}

function getReleaseBranchName() {
  const commitMessage = github.context.payload.head_commit.message;
  if (!commitMessage.includes("Merge pull request"))
    throw new Error(`Commit is not a merge. message={${commitMessage}}`);

  const repoName = github.context.payload.repository.full_name;
  const organization = repoName.split("/")[0];

  const releaseBranchName = commitMessage
    .split(organization)[1]
    .split("\n\n")[0]
    .substring(1);

  return releaseBranchName;
}

async function createTag(newTag, octokit) {
  if (!process.env.GITHUB_SHA) throw new Error(`GITHUB_SHA is missing`);

  console.log("Creating tag");
  await octokit.rest.git.createTag({
    ...github.context.repo,
    tag: newTag,
    message: newTag,
    object: process.env.GITHUB_SHA,
    type: "commit",
  });

  console.log("Pushing new tag");
  await octokit.rest.git.createRef({
    ...github.context.repo,
    ref: `refs/tags/${newTag}`,
    sha: process.env.GITHUB_SHA,
  });
}

async function createRelease(newTag, octokit) {
  const showChangelog = core.getBooleanInput("show-changelog");
  let body = " ";

  if (showChangelog) {
    const listOfPrs =
      await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        ...github.context.repo,
        commit_sha: github.context.payload.head_commit.id,
      });
    const firstPr = listOfPrs.data[0];
    body = `# ${firstPr.title}\n\n${firstPr.body}`;
  }

  console.log("Creating release");
  await octokit.rest.repos.createRelease({
    ...github.context.repo,
    tag_name: newTag,
    name: newTag,
    body: body,
  });
}
