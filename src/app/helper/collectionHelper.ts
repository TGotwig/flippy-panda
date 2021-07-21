import { Deck } from '../interfaces'

export class CollectionHelper {
  public static push(decks: Deck[], deck: Deck) {
    return [...decks, deck].sort((a: Deck, b: Deck) =>
      a.name > b.name ? 1 : -1
    )
  }
}
