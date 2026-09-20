import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink], // 2. Colocar nos imports
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard { }