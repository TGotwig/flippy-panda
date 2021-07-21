import { Component } from '@angular/core'
import { Card } from '../interfaces'
import { CardSide } from '../enums'
import { DataService } from '../#services/data.service'
import { MatDialogRef } from '@angular/material/dialog'
import gsap from 'gsap'
import { DeckService } from '../#services/deck-service/deck.service'

@Component({
  templateUrl: './play-dialog.component.html',
  styleUrls: ['./play-dialog.component.scss'],
})
export class PlayDialogComponent {
  data: Card[]
  actCard: Card
  actWord: string
  actWordLeft: string
  actWordRight: string
  cardSide: CardSide
  chosenCardSide: CardSide
  cardSides = CardSide
  finished = false

  constructor(
    public dataService: DataService,
    public deckService: DeckService,
    private dialogRef: MatDialogRef<PlayDialogComponent>
  ) {
    this.init()
  }

  init() {
    this.data = JSON.parse(
      JSON.stringify(this.deckService.getActiveDeck().cards)
    )
    this.data = this.shuffleArray(this.data)
    this.actCard = this.data.pop()
    this.actWordLeft = this.actCard.left
    this.actWordRight = this.actCard.right
  }

  chooseSide(cardSide: CardSide) {
    if (cardSide === CardSide.top) {
      this.cardSide = CardSide.top
      this.actWord = this.actWordLeft
    } else {
      this.cardSide = CardSide.bottom
      this.actWord = this.actWordRight
    }
    this.chosenCardSide = this.cardSide
  }

  shuffleArray = (arr: Card[]): Card[] => {
    return arr
      .map((a) => [Math.random(), a])
      .sort((a, b) => +a[0] - +b[0])
      .map((a) => a[1]) as Card[]
  }

  flip = () => {
    gsap.from('#question', { rotationY: -180 })
    gsap.from('.cardActionBtn', { pointerEvents: 'none' })
    switch (this.cardSide) {
      case CardSide.top:
        this.cardSide = CardSide.bottom
        this.actWord = this.actWordRight
        break
      case CardSide.bottom:
        this.cardSide = CardSide.top
        this.actWord = this.actWordLeft
    }
  }

  nextCard = (trueAnswer: boolean) => {
    if (!trueAnswer) this.data = [this.actCard, ...this.data]
    if (this.chosenCardSide === CardSide.top) {
      this.cardSide = CardSide.top
    } else {
      this.cardSide = CardSide.bottom
    }
    if (this.data.length) {
      this.actCard = this.data.pop()
      this.actWordLeft = this.actCard.left
      this.actWordRight = this.actCard.right
      if (this.chosenCardSide === CardSide.top) {
        this.actWord = this.actWordLeft
      } else {
        this.actWord = this.actWordRight
      }
    } else {
      this.finished = true
    }
  }

  // ────────────────────────────

  redo() {
    this.init()

    this.finished = false
    this.cardSide = null
  }

  closeDialog = () => this.dialogRef.close()
}
