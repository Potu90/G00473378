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

  //Array to store the list of movies
  movies: any[] = [];

  //Variable to store the search text entered by the user
  searchText: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //Show Trending Movies at the beggining
    this.getTrendingMovies();
  }

  getTrendingMovies() {
    //Call TMBD to get today's trending movies
    this.http.get<any>('https://api.themoviedb.org/3/trending/movie/day?api_key=YOUR_API_KEY').
    subscribe(data => {this.movies = data.results;
    });
  }

  searchMovies() {
    
  }

  goToMovieDetails(movie: any) {
    
  }

  goToFavourites() {
    
  }

}
