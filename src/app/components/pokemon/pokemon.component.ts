import { CommonModule  } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonComponent { 
  @Input() pokemon: any=undefined;
}
