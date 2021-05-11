import * as fs from 'fs'
import * as firebase from '@firebase/rules-unit-testing'

const PROJECT_ID = 'firebase-project-sample' // replace your project id
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'

describe('firestore.rules test', () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId: PROJECT_ID,
      rules: fs.readFileSync('./firestore.rules', 'utf8')
    })
  })
  afterEach(async () => {
    await firebase.clearFirestoreData({projectId: PROJECT_ID})
  })
  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()))
  })
  function adminDb() {
    return firebase.initializeAdminApp({projectId: PROJECT_ID}).firestore()
  }
  function authedDb(auth) {
    return firebase.initializeTestApp({projectId: PROJECT_ID, auth}).firestore()
  }
  require('./users')(authedDb, adminDb)
  require('./projects')(authedDb, adminDb)
})
