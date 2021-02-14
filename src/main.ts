import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true})

    const reportUrl: string = core.getInput('report-url')
    const result = await axios.get(reportUrl)
    const data = result.data
    let allowLines = []
    for (const [index, line] of (data.rules.files[0].content as string)
      .split('\n')
      .entries()) {
      if (/\s*allow/.test(line)) {
        allowLines.push(index + 1)
      }
    }
    const output = []
    for (const report of data.report) {
      allowLines = allowLines.filter(
        allowLine => allowLine !== report.sourcePosition.line
      )
      if (!('values' in report)) {
        const lineNumber = report.sourcePosition.line
        output.push({
          number: lineNumber,
          line: data.rules.files[0].content.split('\n')[lineNumber - 1]
        })
      }
    }
    for (const allowLine of allowLines) {
      output.push({
        number: allowLine,
        line: data.rules.files[0].content.split('\n')[allowLine - 1]
      })
    }
    const content = output
      .sort((a, b) => (a.number > b.number ? 1 : -1))
      .map(a => `${a.number} ${a.line}`)
    const {
      issue: {number: issue_number},
      repo: {owner, repo}
    } = github.context
    const octokit = github.getOctokit(token)
    octokit.issues.createComment({
      issue_number,
      owner,
      repo,
      body: `Lack of test rule lines!\n\`\`\`\n${content}\n\`\`\``
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
