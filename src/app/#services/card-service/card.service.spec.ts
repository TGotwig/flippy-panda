import { TestBed, inject } from '@angular/core/testing'
import { CardService } from './card.service'
import { Card } from '../../interfaces'

import { dataWithOneCard, dataWithNoCards } from '../mock'
import { DataService } from '../data.service'

describe('CardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardService],
    })
  })

  it('🎴 should add a Card', inject(
    [DataService, CardService],
    (dataService: DataService, cardService: CardService) => {
      const card: Card = cardService.addCard('left', 'right', dataWithNoCards)
      expect(card).toEqual({
        id: card.id,
        left: 'left',
        right: 'right',
      })
      expect(dataService.getData().realms[0].decks[0].cards[0]).toEqual({
        id: card.id,
        left: 'left',
        right: 'right',
      })
    }
  ))

  it('🎴 should remove a Card', inject(
    [DataService, CardService],
    (dataService: DataService, cardService: CardService) => {
      const leftCards: Card[] = cardService.removeCard('id', dataWithOneCard)
      expect(leftCards.length).toEqual(0)
      expect(dataService.getData().realms[0].decks[0].cards.length).toEqual(0)
    }
  ))
})
