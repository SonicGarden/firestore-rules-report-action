import * as firebase from '@firebase/rules-unit-testing'

module.exports = (authedDb, adminDb) => {
  describe('users', () => {
    describe('does not sign in', () => {
      const db = authedDb()

      beforeEach(async () => {
        adminDb().collection('users').doc('member1').set({name: 'member1'})
      })
      it('can not read', async () => {
        const ref = db.collection('users').doc('member1')
        await firebase.assertFails(ref.get())
      })
      it('can not add', async () => {
        const ref = db.collection('users')
        await firebase.assertFails(ref.add({name: 'member2'}))
      })
    })
  })
}
