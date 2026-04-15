import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonLabel, IonItem } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSearchbar, IonButton, IonLabel, IonItem]
})
export class HomePage implements OnInit {

  movies: any[] = [];                                  //Array to store the list of movies
  searchText: string = '';                             //Variable to store the search text entered by the user
  apiKey: string = '04b4a3b05536f796e2be2bb50fb5c234'; //API key to authenticate requests 


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    //Show Trending Movies at the beggining
    this.getTrendingMovies();
  }

  getTrendingMovies() {
    //Call web page to get today's trending movies
    this.http.get<any>(`https://api.themoviedb.org/3/trending/movie/day?api_key=${this.apiKey}`).
    subscribe(data => {this.movies = data.results;
    //Test: print the data received from the API
    console.log(data);
    });
  }

  searchMovies() {
    //If search is empty, show trending movies
    if (this.searchText == '') {
      this.getTrendingMovies();
      return;
    }

    //Call it with the search text and wait for the response
    this.http.get<any>(`https://api.themoviedb.org/3/search/movie?query=${this.searchText}&api_key=${this.apiKey}`).
    subscribe(data => {this.movies = data.results;
    });
  }

  goToMovieDetails(movie: any) {
    // Navigate to movie details page passing the movie id
    this.router.navigate(['/movie-details', movie.id]);
  }

  goToFavourites() {
    //Navigate to favourites page
    this.router.navigate(['/favourites']);
  }

}
