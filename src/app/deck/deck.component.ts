import { Component, ViewChild } from '@angular/core'
import { MatTable } from '@angular/material/table'
import { DataService } from '../#services/data.service'
import { MatInput } from '@angular/material/input'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Data, Card } from '../interfaces'
import { PlayDialogComponent } from '../play-dialog/play-dialog.component'
import { RenameDialogComponent } from '../rename-dialog/rename-dialog.component'
import { faPlayCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { RealmService } from '../#services/realm-service/realm.service'
import { DeckService } from '../#services/deck-service/deck.service'
import { CardService } from '../#services/card-service/card.service'

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent {
  displayedColumns: string[] = ['cardIcon', 'left', 'right', 'remove']
  newName: string
  data: Data
  faPlayCircle = faPlayCircle
  faTimes = faTimes

  @ViewChild(MatTable, { static: true }) table: MatTable<any>
  @ViewChild('topside', { static: true }) topSideInput: MatInput

  constructor(
    public dataService: DataService,
    public realmService: RealmService,
    public deckService: DeckService,
    public cardService: CardService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.data = dataService.data
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2000 })
  }

  openPlayDialog = () => {
    if (this.dataService.getActiveDeck().cards.length > 0) {
      this.dialog.open(PlayDialogComponent, {
        backdropClass: 'backdrop',
        width: '90%',
        height: '90%',
      })
    }
  }

  addCard(event: Event) {
    event.preventDefault()

    const textareas = document.querySelectorAll('input')
    const leftText: string = textareas[0].value
    const rightText: string = textareas[1].value

    this.cardService.addCard(leftText, rightText)
    if (this.table) this.table.renderRows()
    textareas.forEach((e) => (e.value = ''))
    this.topSideInput.focus()
    this.openSnackBar(`🎴Card("${leftText}", "${rightText}")`, 'Added 📥')
  }

  openRenameDeckDialog = () =>
    this.dialog.open(RenameDialogComponent, {
      id: 'rename-deck-dialog',
      data: {
        placeholder: 'New deck-name ✍️',
        value: this.dataService.getActiveDeck().name,
        fun: this.deckService.renameDeck,
      },
    })

  removeDeck = () => this.deckService.removeDeck()

  removeCard = (card: Card) => this.cardService.removeCard(card.id)
}
