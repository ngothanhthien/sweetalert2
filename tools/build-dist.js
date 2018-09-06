const pify = require('pify')
const rimraf = require('rimraf')
const execute = require('../utils/execute')
const pushBranch = require('./push-branch')

const log = console.log // eslint-disable-line
const removeDir = pify(rimraf)

const version = process.argv[2]

;(async () => {
  log('Resetting the current branch...')
  await execute('git fetch')
  await execute('git checkout .')

  log(`Pulling the latest dist branch from Github...`)
  await execute('git pull origin --rebase')

  log('Deleting the current dist folder...')
  await removeDir('dist')

  log('Running the build...')
  await execute('yarn build')

  log('Committing the dist dir...')
  await execute(`git add --force dist/ && git commit -m "chore: add dist for ${version}"`)

  await pushBranch('dist')

  log('OK!')
})().catch(console.error)