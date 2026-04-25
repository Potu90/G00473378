import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/angular/standalone';import { HttpOptions } from '@capacitor/core';
import { Router } from '@angular/router';
import { MyHttpService } from 'src/app/services/my-http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonItem, IonLabel, IonList, IonListHeader, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  movies: any[] = [];                                  //Array to store the list of movies
  searchText: string = '';                             //Variable to store the search text entered by the user
  apiKey: string = '04b4a3b05536f796e2be2bb50fb5c234'; //API key to authenticate requests


  constructor(private mhs: MyHttpService, private router: Router) { }

  ngOnInit() {
    //Show Trending Movies at the beggining
    this.getTrendingMovies();
  }

  async getTrendingMovies() {
    //Call web page to get today's trending movies
    const options: HttpOptions = {
      url: `https://api.themoviedb.org/3/trending/movie/day?api_key=${this.apiKey}`
    };
    const data = await this.mhs.get(options);
    this.movies = data.results;
  }

  async searchMovies() {
    //If search is empty, show trending movies
    if (this.searchText == '') {
      this.getTrendingMovies();
      return;
    }

    //Call it with the search text and wait for the response
    const options: HttpOptions = {
      url: `https://api.themoviedb.org/3/search/movie?query=${this.searchText}&api_key=${this.apiKey}`
    };
    const data = await this.mhs.get(options);
    this.movies = data.results;
  }

  goToMovieDetails(movie: any) {
    //Navigate to movie details page passing the movie id
    this.router.navigate(['/movie-details', movie.id]);
  }

  goToFavourites() {
    //Navigate to favourites page
    this.router.navigate(['/favourites']);
  }

}