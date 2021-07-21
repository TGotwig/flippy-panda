import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { Data } from '../interfaces'
import { CardSide } from '../enums'

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

  setData(data: Data): Data {
    this.data = Object.assign(this.data, data)
    localStorage.setItem(LS_ITEM_NAME, JSON.stringify(this.getData()))
    return this.data
  }
}
