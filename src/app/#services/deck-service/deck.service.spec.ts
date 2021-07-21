import { TestBed, inject } from '@angular/core/testing'
import { DeckService } from './deck.service'
import { Deck } from '../../interfaces'

import { dataWithOneRealm, dataWithNoCards } from '../mock'
import { DataService } from '../data.service'

describe('DeckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeckService],
    })
  })

  it('🗃 should add a Deck', inject(
    [DataService, DeckService],
    (dataService: DataService, deckService: DeckService) => {
      const [newDeck, decks]: [Deck, Deck[]] =
        deckService.addDeck(dataWithOneRealm)
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
      expect(dataService.getData().realms[0].decks).toEqual([
        {
          id: newDeck.id,
          name: `🗃 deck #1`,
          cards: [],
        },
      ])
    }
  ))

  it('🗃 should remove a Deck', inject(
    [DeckService],
    (deckService: DeckService) => {
      const leftDecks: Deck[] = deckService.removeDeck('id', dataWithNoCards)
      expect(leftDecks.length).toEqual(0)
    }
  ))

  it('🗃 should rename a Deck', inject(
    [DeckService],
    (deckService: DeckService) => {
      expect(deckService.getActiveDeck(dataWithNoCards).name).toEqual('name')
      expect(deckService.renameDeck('na', dataWithNoCards).name).toEqual('na')

      expect(deckService.getActiveDeck().name).toEqual('na')
    }
  ))

  it('🗃 should get a Deck', inject([DeckService], (service: DeckService) => {
    const deck: Deck = service.getDeck('id', dataWithNoCards)
    expect(deck).toEqual({ id: 'id', name: 'name', cards: [] })
  }))

  it('🗃 should get active Deck', inject(
    [DeckService],
    (service: DeckService) => {
      const deck: Deck = service.getActiveDeck(dataWithNoCards)
      expect(deck).toEqual({ id: 'id', name: 'name', cards: [] })
    }
  ))
})
