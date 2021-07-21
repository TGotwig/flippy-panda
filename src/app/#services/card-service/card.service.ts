import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { Card, Data, } from 'src/app/interfaces'
import { DataService } from '../data.service'
import { DeckService } from '../deck-service/deck.service'
import { RealmService } from '../realm-service/realm.service'

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(
    public dataService: DataService,
    public realmService: RealmService,
    public deckService: DeckService
  ) {}

  /**
   * Adds a new card and returns it, together with a new list of cards.
   *
   * @param topSideText - The top-side-text of the new card
   * @param bottomSideText - The bottom-side-text of the new card
   * @param data - A Data object as template
   * @returns The new card and a updated list of cards
   */
  addCard(
    topSideText: string,
    bottomSideText: string,
    data: Data = this.dataService.getData()
  ): Card {
    const card = {
      id: this.createUniqueId(),
      left: topSideText,
      right: bottomSideText,
    }

    this.dataService.setData({
      ...data,
      realms: data.realms.map((realm) => {
        if (realm.id === this.realmService.getActiveRealm(data).id) {
          return {
            ...realm,
            decks: realm.decks.map((deck) => {
              if (deck.id === this.deckService.getActiveDeck(data).id) {
                return { ...deck, cards: [...deck.cards, card] }
              } else return deck
            }),
          }
        } else return realm
      }),
    })

    return card
  }

  /**
   * Removes a card and returns the other cards.
   *
   * @param id - The id of the card which should be removed
   * @param data - A Data object as template
   * @returns A new list of cards without the removed one
   */
  removeCard(id: string, data: Data = this.dataService.getData()): Card[] {
    const activeRealm = this.realmService.getActiveRealm(data)
    const activeDeck = this.deckService.getActiveDeck(data)
    const leftCards = activeDeck.cards.filter((e) => e.id !== id)

    this.dataService.setData({
      ...data,
      realms: data.realms.map((realm) => {
        if (realm.id === activeRealm.id) {
          return {
            ...realm,
            decks: realm.decks.map((deck) => {
              if (deck.id === activeDeck.id) {
                return { ...deck, cards: leftCards }
              } else return deck
            }),
          }
        } else return realm
      }),
    })

    return leftCards
  }

  createUniqueId = (): string => Guid.create().toString()
}
