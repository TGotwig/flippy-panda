import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { CollectionHelper } from 'src/app/helper/collectionHelper'
import { Data, Deck, Realm } from 'src/app/interfaces'
import { DataService } from '../data.service'
import { RealmService } from '../realm-service/realm.service'

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  constructor(
    public dataService: DataService,
    public realmService: RealmService
  ) {}

  addDeck(
    data: Data = this.dataService.getData()
  ): [newDeck: Deck, newDecks: Deck[]] {
    const actRealm: Realm = this.realmService.getActiveRealm(data)
    const decks: Deck[] = actRealm.decks
    const id = this.createUniqueId()

    const newDeck = {
      id: id,
      name: `🗃 deck #${decks.length + 1}`,
      cards: [],
    }

    const newDecks = CollectionHelper.push(decks, newDeck)

    this.dataService.setData({
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
    id: string = this.getActiveDeck(this.dataService.getData()).id,
    data: Data = this.dataService.getData()
  ): Deck[] {
    const activeRealm: Realm = this.realmService.getActiveRealm(data)
    const realms: Realm[] = data.realms

    if (!activeRealm.decks.length) return []

    const decks = activeRealm.decks
    const activeDeckIdx = decks.findIndex((deck) => deck.id === id)
    const leftDecks = decks.filter((deck) => deck.id !== id)

    this.dataService.setData({
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

  renameDeck(newName: string, data: Data = this.dataService.getData()): Deck {
    const activeDeck = this.getActiveDeck(data)
    const newDeck: Deck = {
      ...activeDeck,
      name: newName,
    }

    this.removeDeck(activeDeck.id, data)

    this.dataService.setData({
      ...data,
      realms: [
        ...data.realms.filter(
          (actRealm) => actRealm !== this.realmService.getActiveRealm(data)
        ),
        {
          ...this.realmService.getActiveRealm(data),
          activeDeckId: newDeck.id,
          decks: CollectionHelper.push(
            this.realmService.getActiveRealm(data).decks,
            newDeck
          ),
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
    realms: Realm[] = this.dataService.getData().realms,
    activeRealm: Realm = this.realmService.getActiveRealm()
  ) => {
    this.dataService.setData({
      ...this.dataService.getData(),
      realms: realms.map((realm) => {
        if (realm.id === activeRealm.id) {
          return { ...realm, activeDeckId: targetDeckId }
        } else return { ...realm }
      }),
    })
  }

  // todo: move this into deck.service.ts
  getDeck = (id: String, data: Data = this.dataService.getData()): Deck =>
    data.realms
      .map((realm) => realm.decks.filter((deck) => deck.id === id))
      .map((arr) => (arr.length > 0 ? arr[0] : null))
      .filter(Boolean)[0]

  // todo: move this into deck.service.ts
  getActiveDeck = (data: Data = this.dataService.getData()): Deck =>
    this.getDeck(this.realmService.getActiveRealm(data).activeDeckId, data)

  createUniqueId = (): string => Guid.create().toString()
}
