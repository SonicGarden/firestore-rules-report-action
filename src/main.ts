import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'
import replaceComment, {deleteComment} from '@aki77/actions-replace-comment'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const commentGeneralOptions = () => {
  const pullRequestId = github.context.issue.number
  if (!pullRequestId) {
    throw new Error('Cannot find the PR id.')
  }

  return {
    token: core.getInput('token', {required: true}),
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: pullRequestId
  }
}

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true})

    const reportUrl: string = core.getInput('report-url')
    const result = await axios.get(reportUrl)
    const data = result.data
    const output = []
    for (const report of data.report) {
      if (!('values' in report)) {
        const lineNumber = report.sourcePosition.line
        output.push({
          number: lineNumber,
          line: data.rules.files[0].content.split('\n')[lineNumber - 1]
        })
      }
    }
    const content = output
      .sort((a, b) => (a.number > b.number ? 1 : -1))
      .map(a => `${a.number} ${a.line}`)
      .join('\n')
    const {
      issue: {number: issue_number},
      repo: {owner, repo}
    } = github.context
    const comment =
      output.length > 0
        ? `:scream: Lack of test rule lines!\n\`\`\`\n${content}\n\`\`\``
        : ':tada: Security rule test is covered!'
    await replaceComment({
      token,
      issue_number,
      owner,
      repo,
      body: `Firestore rules coverage report!\n${comment}`
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
