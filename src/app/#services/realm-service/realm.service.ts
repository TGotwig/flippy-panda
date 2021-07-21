import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { Data, Realm } from '../../interfaces'
import { DataService } from '../data.service'

@Injectable({
  providedIn: 'root',
})
export class RealmService {
  constructor(public dataService: DataService) {}

  /**
   * @param data - A Data object as template
   * @returns Updated list of realms with a new one
   */
  addRealm(data: Data = this.dataService.getData()): Realm[] {
    const realmId = this.createUniqueId()
    this.dataService.setData({
      ...data,
      realms: [
        ...data.realms,
        {
          id: realmId,
          name: `🌌 Realm #${data.realms.length + 1}`,
          decks: [],
          activeDeckId: undefined,
        },
      ],
      activeRealmId: realmId,
    })
    return this.getRealms()
  }

  // todo: implement
  renameRealm() {}

  /**
   * Removes a realm and returns the other realms.
   *
   * @param id - The id of the realm which should be removed
   * @param data - A Data object as template
   * @returns A new list of realms without the passed realm
   */
  removeRealm(
    id: String = this.getActiveRealm().id,
    data: Data = this.dataService.getData()
  ): Realm[] {
    const leftRealms = data.realms.filter((realm) => realm.id !== id)
    const realmsCnt = leftRealms.length
    this.dataService.setData({
      ...data,
      realms: leftRealms,
      activeRealmId: realmsCnt > 0 ? leftRealms[realmsCnt - 1].id : null,
    })
    return this.dataService.getData().realms
  }

  getActiveRealm(data: Data = this.dataService.getData()): Realm {
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

  changeRealm(activeRealmId: string) {
    this.dataService.setData({ ...this.dataService.getData(), activeRealmId })
  }

  getRealm = (id: String, data: Data = this.dataService.getData()): Realm =>
    data.realms.filter((realm) => realm.id === id)[0]

  getRealms = (): Realm[] => this.dataService.getData().realms

  createUniqueId = (): string => Guid.create().toString()
}
