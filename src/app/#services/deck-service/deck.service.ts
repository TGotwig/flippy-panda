import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
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
    const actRealm: Realm = this.dataService.getActiveRealm(data)
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
    id: string = this.dataService.getActiveDeck(this.dataService.getData()).id,
    data: Data = this.dataService.getData()
  ): Deck[] {
    const activeRealm: Realm = this.dataService.getActiveRealm(data)
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

  renameDeck(newName: string, data: Data = this.dataService.data): Deck {
    const lastName = this.dataService.getActiveDeck(data).name
    const newDeck: Deck = {
      ...this.dataService.getActiveDeck(data),
      name: newName,
    }

    this.dataService.setData({
      ...data,
      realms: [
        ...data.realms.filter(
          (actRealm) => actRealm !== this.dataService.getActiveRealm(data)
        ),
        {
          ...this.dataService.getActiveRealm(data),
          decks: [
            ...this.dataService
              .getActiveRealm(data)
              .decks.filter((deck) => deck.name !== lastName),
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
    realms: Realm[] = this.dataService.data.realms,
    activeRealm: Realm = this.dataService.getActiveRealm()
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

  createUniqueId = (): string => Guid.create().toString()
}
