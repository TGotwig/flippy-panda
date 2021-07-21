import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { Data, Deck, Card } from '../interfaces'
import { CardSide } from '../enums'
import { Realm } from '../interfaces'
import { RealmService } from './realm-service/realm.service'

const LS_ITEM_NAME = 'flippyPanda' // name of the localStorage item

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data: Data = {
    realms: [],
    activeRealmId: undefined,
  }
  chosenCardSide = CardSide.top

  constructor() {
    const lStorage = JSON.parse(localStorage.getItem('flippyPanda'))
    if (lStorage) {
      this.data = lStorage
    } else {
      const realmId = this.createUniqueId()
      this.data = {
        ...lStorage,
        realms: [],
        activeRealmId: realmId,
      }
    }
  }

  createUniqueId = (): string => Guid.create().toString()

  getData = () => this.data

  setData(data: Data) {
    this.data = Object.assign(this.data, data)
    localStorage.setItem(LS_ITEM_NAME, JSON.stringify(this.getData()))
  }

  // ----------
  // REALMS 🌌
  // ----------

  // todo: move this into realm.service.ts
  getActiveRealm(data: Data = this.data): Realm {
    const id: string = data.activeRealmId
    if (data.realms.length > 0) {
      return data.realms.filter((realm) => realm.id === id)[0]
    } else {
      return {
        id: undefined,
        name: undefined,
        decks: [],
        activeDeckId: undefined,
      }
    }
  }

  // ----------
  // DECKS 🗃
  // ----------

  // todo: move this into deck.service.ts
  getDeck = (id: String, data: Data = this.data): Deck =>
    data.realms
      .map((realm) => realm.decks.filter((deck) => deck.id === id))
      .map((arr) => (arr.length > 0 ? arr[0] : null))
      .filter(Boolean)[0]

  // todo: move this into deck.service.ts
  getActiveDeck = (data: Data = this.getData()): Deck =>
    this.getDeck(this.getActiveRealm(data).activeDeckId, data)

  // ----------
  // CARDS 🎴
  // ----------

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
    data: Data = this.data
  ): Card {
    const card = {
      id: this.createUniqueId(),
      left: topSideText,
      right: bottomSideText,
    }

    this.setData({
      ...data,
      realms: data.realms.map((realm) => {
        if (realm.id === this.getActiveRealm(data).id) {
          return {
            ...realm,
            decks: realm.decks.map((deck) => {
              if (deck.id === this.getActiveDeck(data).id) {
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
  removeCard(id: string, data: Data = this.data): Card[] {
    const activeRealm = this.getActiveRealm(data)
    const activeDeck = this.getActiveDeck(data)
    const leftCards = activeDeck.cards.filter((e) => e.id !== id)

    this.setData({
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
}
