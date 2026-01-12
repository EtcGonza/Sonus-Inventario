import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css' // Wait, I didn't see app.css created? The generator said app.css created.
})
export class App {
  title = 'sonus-inventario';
}
