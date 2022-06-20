import { Component, EventEmitter, OnInit, Output } from '@angular/core';

enum colors {
  RED = "#e92c64",
  GREEN = "#009886",
  LIME = "#719d3c",
  BLUE = "#208eed",
  DARKBLUE = "#144973",
  PURPLE = "#aa33aa",
  BROWN = "#b36619",
  GREY = "#808080",
}

@Component({
  selector: 'app-color-panel',
  templateUrl: './color-panel.component.html',
  styleUrls: ['./color-panel.component.scss']
})
export class ColorPanelComponent implements OnInit {

  @Output() emitColor: EventEmitter<string> = new EventEmitter();

  colorsData = Object.values(colors)

  constructor() { }

  ngOnInit(): void {
  }

  onColorEmit(color: string) {
    this.emitColor.emit(color);
  }

}
