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
   * Adds a new realm and returns it, together with a new list of realms.
   *
   * @param data - A Data object as template
   * @returns The new realm and a updated list of realms
   */
  addRealm(data: Data = this.dataService.getData()): [Realm, Realm[]] {
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
    return [this.getRealm(realmId), this.getRealms()]
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
    id: String = this.dataService.getActiveRealm().id,
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

  changeRealm(activeRealmId: string) {
    this.dataService.setData({ ...this.dataService.getData(), activeRealmId })
  }

  getRealm = (id: String, data: Data = this.dataService.getData()): Realm =>
    data.realms.filter((realm) => realm.id === id)[0]

  getRealms = (): Realm[] => this.dataService.getData().realms

  createUniqueId = (): string => Guid.create().toString()
}
