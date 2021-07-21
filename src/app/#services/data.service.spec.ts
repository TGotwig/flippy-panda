import { TestBed, inject } from '@angular/core/testing'
import { DataService } from './data.service'
import { Realm, Deck, Card } from '../interfaces'

import { dataWithOneRealm, dataWithNoCards, dataWithOneCard } from './mock'

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
    })
  })

  it('🌌 should get active Realm', inject(
    [DataService],
    (service: DataService) => {
      const realm: Realm = service.getActiveRealm(dataWithOneRealm)
      expect(realm.id).toEqual('id')
    }
  ))

  it('🗃 should get a Deck', inject([DataService], (service: DataService) => {
    const deck: Deck = service.getDeck('id', dataWithNoCards)
    expect(deck).toEqual({ id: 'id', name: 'name', cards: [] })
  }))

  it('🗃 should get active Deck', inject(
    [DataService],
    (service: DataService) => {
      const deck: Deck = service.getActiveDeck(dataWithNoCards)
      expect(deck).toEqual({ id: 'id', name: 'name', cards: [] })
    }
  ))
})
