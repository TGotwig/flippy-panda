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
  private data: Data = {
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
}
