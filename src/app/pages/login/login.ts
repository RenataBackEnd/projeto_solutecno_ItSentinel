import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink], // 2. Adicione o RouterLink aqui dentro
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login { }
