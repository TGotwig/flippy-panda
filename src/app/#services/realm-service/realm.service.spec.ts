import { TestBed, inject } from '@angular/core/testing'
import { RealmService } from './realm.service'
import { Realm } from '../../interfaces'

import { dataWithNoRealms, dataWithOneRealm } from '../mock'

describe('RealmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealmService],
    })
  })

  it('🌌 should add a Realm', inject(
    [RealmService],
    (service: RealmService) => {
      const realms = service.addRealm(dataWithNoRealms)
      expect(realms).toEqual([
        {
          id: realms[0].id,
          name: `🌌 Realm #1`,
          decks: [],
          activeDeckId: undefined,
        },
      ])
    }
  ))

  it('🌌 should remove a Realm', inject(
    [RealmService],
    (service: RealmService) => {
      const realms: Realm[] = service.removeRealm('id', dataWithOneRealm)
      expect(realms).toEqual([])
    }
  ))

  it('🌌 should get a Realm', inject(
    [RealmService],
    (service: RealmService) => {
      const realm: Realm = service.getRealm('id', dataWithOneRealm)
      expect(realm.id).toEqual('id')
    }
  ))

  it('🌌 should get active Realm', inject(
    [RealmService],
    (service: RealmService) => {
      const realm: Realm = service.getActiveRealm(dataWithOneRealm)
      expect(realm.id).toEqual('id')
    }
  ))
})
