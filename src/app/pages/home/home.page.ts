import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  //Array to store the list of movies returned from the API
  movies: any[] = [];

  //Variable to store the search text entered by the user
  searchText: string = '';

  //API key to authenticate requests to TMDB
  apiKey: string = '04b4a3b05536f796e2be2bb50fb5c234';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //Show Trending Movies at the beggining
    this.getTrendingMovies();
  }

  getTrendingMovies() {

  }

  searchMovies() {
    
  }

  goToMovieDetails() {
    
  }

  goToFavourites() {
    
  }

}
