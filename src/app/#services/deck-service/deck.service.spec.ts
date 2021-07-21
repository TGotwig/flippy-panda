import { TestBed, inject } from '@angular/core/testing'
import { DeckService } from './deck.service'
import { Deck, Realm } from '../../interfaces'

import { dataWithNoRealms, dataWithOneRealm, dataWithNoCards } from '../mock'
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
    [DataService, DeckService],
    (dataService: DataService, deckService: DeckService) => {
      expect(dataService.getActiveDeck(dataWithNoCards).name).toEqual('name')
      expect(deckService.renameDeck('na', dataWithNoCards).name).toEqual('na')

      expect(dataService.getActiveDeck().name).toEqual('na')
    }
  ))
})
