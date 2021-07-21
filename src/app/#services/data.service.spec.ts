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

  it('🎴 should add a Card', inject([DataService], (service: DataService) => {
    const card: Card = service.addCard('left', 'right', dataWithNoCards)
    expect(card).toEqual({
      id: card.id,
      left: 'left',
      right: 'right',
    })
    expect(service.getData().realms[0].decks[0].cards[0]).toEqual({
      id: card.id,
      left: 'left',
      right: 'right',
    })
  }))

  it('🎴 should remove a Card', inject(
    [DataService],
    (service: DataService) => {
      const leftCards: Card[] = service.removeCard('id', dataWithOneCard)
      expect(leftCards.length).toEqual(0)
      expect(service.getData().realms[0].decks[0].cards.length).toEqual(0)
    }
  ))
})
