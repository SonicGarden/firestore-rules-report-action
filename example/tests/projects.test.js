import * as firebase from '@firebase/rules-unit-testing'

module.exports = (authedDb, adminDb) => {
  describe('projects', () => {
    describe('does not sign in', () => {
      const db = authedDb()

      beforeEach(async () => {
        adminDb()
          .collection('projects')
          .doc('project1')
          .set({name: 'Test Project'})
      })
      it('can not read', async () => {
        const ref = db.collection('projects').doc('project1')
        await firebase.assertFails(ref.get())
      })
      it('can not add', async () => {
        const ref = db.collection('users')
        await firebase.assertFails(ref.add({name: 'Add project'}))
      })
    })
  })
}
