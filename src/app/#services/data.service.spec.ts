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

  it('🗃 should add a Deck', inject([DataService], (service: DataService) => {
    const [newDeck, decks]: [Deck, Deck[]] = service.addDeck(dataWithOneRealm)
    expect(newDeck).toEqual({
      id: newDeck.id,
      name: `🗃 deck #1`,
      cards: [],
    })
    expect(decks).toEqual([
      {
        id: newDeck.id,
        name: `🗃 deck #1`,
        cards: [],
      },
    ])
    expect(service.getData().realms[0].decks).toEqual([
      {
        id: newDeck.id,
        name: `🗃 deck #1`,
        cards: [],
      },
    ])
  }))

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

  it('🗃 should remove a Deck', inject([DataService], (service: DataService) => {
    const leftDecks: Deck[] = service.removeDeck('id', dataWithNoCards)
    expect(leftDecks.length).toEqual(0)
  }))

  it('🗃 should rename a Deck', inject([DataService], (service: DataService) => {
    expect(service.getActiveDeck(dataWithNoCards).name).toEqual('name')
    expect(service.renameDeck('na', dataWithNoCards).name).toEqual('na')

    expect(service.getActiveDeck().name).toEqual('na')
  }))

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
