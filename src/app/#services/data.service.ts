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

  addDeck(data: Data = this.data): [newDeck: Deck, newDecks: Deck[]] {
    const actRealm: Realm = this.getActiveRealm(data)
    const decks: Deck[] = actRealm.decks
    const id = this.createUniqueId()

    const newDeck = {
      id: id,
      name: `🗃 deck #${decks.length + 1}`,
      cards: [],
    }
    const newDecks = [...decks, newDeck].sort((a: Deck, b: Deck) =>
      a.name > b.name ? 1 : -1
    )

    this.setData({
      ...data,
      realms: data.realms.map((realm) => {
        if (realm.id === actRealm.id) {
          return {
            ...realm,
            decks: newDecks,
            activeDeckId: id,
          }
        } else return realm
      }),
    })

    return [newDeck, newDecks]
  }

  removeDeck(
    id: string = this.getActiveDeck(this.getData()).id,
    data: Data = this.data
  ): Deck[] {
    const activeRealm: Realm = this.getActiveRealm(data)
    const realms: Realm[] = data.realms

    if (!activeRealm.decks.length) return []

    const decks = activeRealm.decks
    const activeDeckIdx = decks.findIndex((deck) => deck.id === id)
    const leftDecks = decks.filter((deck) => deck.id !== id)

    this.setData({
      ...data,
      realms: realms.map((realm) => {
        if (realm.id === activeRealm.id) {
          if (decks.length === 1) {
            return {
              ...realm,
              decks: leftDecks,
              activeDeckId: undefined,
            }
          } else if (decks.length === activeDeckIdx + 1) {
            return {
              ...realm,
              decks: leftDecks,
              activeDeckId: decks[activeDeckIdx - 1].id,
            }
          } else {
            return {
              ...realm,
              decks: leftDecks,
              activeDeckId: decks[activeDeckIdx + 1].id,
            }
          }
        } else return realm
      }),
    })
    return leftDecks
  }

  renameDeck(newName: string, data: Data = this.data): Deck {
    const lastName = this.getActiveDeck(data).name
    const newDeck: Deck = {
      ...this.getActiveDeck(data),
      name: newName,
    }

    this.setData({
      ...data,
      realms: [
        ...data.realms.filter(
          (actRealm) => actRealm !== this.getActiveRealm(data)
        ),
        {
          ...this.getActiveRealm(data),
          decks: [
            ...this.getActiveRealm(data).decks.filter(
              (deck) => deck.name !== lastName
            ),
            newDeck,
          ].sort((a: Deck, b: Deck) => (a.name > b.name ? 1 : -1)),
        },
      ],
    })

    return newDeck
  }

  /**
   * Removes a realm and returns the other realms.
   *
   * @param targetDeckId - The ID from the Deck you want to switch to
   * @param realms - The ID from the Deck you want to switch to
   * @returns A new list of realms without the passed realm
   */
  changeActiveDeck = (
    targetDeckId: string,
    realms: Realm[] = this.data.realms,
    activeRealm: Realm = this.getActiveRealm()
  ) => {
    this.setData({
      ...this.getData(),
      realms: realms.map((realm) => {
        if (realm.id === activeRealm.id) {
          return { ...realm, activeDeckId: targetDeckId }
        } else return { ...realm }
      }),
    })
  }

  getDecks(data: Data = this.data) {
    return this.getActiveRealm(data).decks
  }

  getDeck = (id: String, data: Data = this.data): Deck =>
    data.realms
      .map((realm) => realm.decks.filter((deck) => deck.id === id))
      .map((arr) => (arr.length > 0 ? arr[0] : null))
      .filter(Boolean)[0]

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
