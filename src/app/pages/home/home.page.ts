import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonItem, IonLabel, IonList, IonListHeader, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { HttpOptions } from '@capacitor/core';
import { Router } from '@angular/router';
import { MyHttpService } from 'src/app/services/my-http.service';
import { MyDataService } from 'src/app/services/my-data.service';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonItem, IonLabel, IonList, IonListHeader, IonButtons, IonIcon, CommonModule, FormsModule]
})

export class HomePage implements OnInit {

  movies: any[] = [];                                  //Array to store the list of movies
  searchText: string = '';                             //Variable to store the search text entered by the user
  recentSearches: string[] = [];                       //Array of recent search terms loaded from storage
  apiKey: string = '04b4a3b05536f796e2be2bb50fb5c234'; //API key to authenticate requests


  constructor(private mhs: MyHttpService, private mds: MyDataService, private router: Router) {
    addIcons({ heart });
  }
  
  ngOnInit() {
    //Show Trending Movies at the beggining
    this.getTrendingMovies();
    //Load recent searches from storage
    this.loadRecentSearches();
  }

  //Reload recent searches every time the user enters this page
  async ionViewWillEnter() {
    await this.loadRecentSearches();
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

    //Save the search term to recent searches
    await this.saveSearch(this.searchText);
  }

  //Load recent searches from storage
  async loadRecentSearches() {
    let data = await this.mds.get('searches');
    //If there are no searches yet, use empty array
    if (data == null) {
      this.recentSearches = [];
    } else {
      this.recentSearches = data;
    }
  }

  //Save a search term to the recent searches list
  async saveSearch(term: string) {
    //Get current list from storage
    let searches = await this.mds.get('searches');
    if (searches == null) {
      searches = [];
    }

    //Remove the term if it already exists to avoid duplicates
    for (let i = 0; i < searches.length; i++) {
      if (searches[i] == term) {
        searches.splice(i, 1);
        break;
      }
    }

    //Add the new term at the beginning of the list
    searches.unshift(term);

    //Keep only the last 5 searches
    if (searches.length > 5) {
      searches = searches.slice(0, 5);
    }

    //Save back to storage
    await this.mds.set('searches', searches);

    //Update the variable so the HTML refreshes
    this.recentSearches = searches;
  }

  //Run a search again from the recent searches list
  searchAgain(term: string) {
    this.searchText = term;
    this.searchMovies();
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