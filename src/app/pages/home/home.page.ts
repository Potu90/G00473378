import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonItem, IonLabel, IonList, IonListHeader, IonButtons, IonIcon, IonBadge } from '@ionic/angular/standalone';
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
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonItem, IonLabel, IonList, IonListHeader, IonButtons, IonIcon, IonBadge, CommonModule, FormsModule]
})

export class HomePage implements OnInit {

  searchText: string = '';                              //Variable to store the search text entered by the user
  movies: any[] = [];                                   //Array to store the list of movies
  recentSearches: string[] = [];                        //Array of recent search terms loaded from storage
  showRecentSearches: boolean = false;                  //Controls if the recent searches dropdown is open
  favouritesCount: number = 0;                          //Number of favourite movies, shown as a badge
  apiKey: string = '04b4a3b05536f796e2be2bb50fb5c234';  //API key to authenticate requests


  constructor(private mhs: MyHttpService, private mds: MyDataService, private router: Router) {
    addIcons({ heart });
  }

  //Runs once when the page is created
  ngOnInit() {
    this.getTrendingMovies();         //Show Trending Movies at the beggining
    this.loadRecentSearches();        //Load recent searches from storage
    this.loadFavouritesCount();       //Load number of favourites for the badge
  }

  //Runs every time the user enters this page (it is a lifecycle hook for everytime is navigated to)
  async ionViewWillEnter() {
    //Reload recent searches and favourites count in case they changed
    await this.loadRecentSearches();
    await this.loadFavouritesCount();
  }

  //Call web page to get today's trending movies
  async getTrendingMovies() {
    const options: HttpOptions = {url: `https://api.themoviedb.org/3/trending/movie/day?api_key=${this.apiKey}`};
    const data = await this.mhs.get(options);
    this.movies = data.results;
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

  //Load the number of favourites from storage to show in the badge
  async loadFavouritesCount() {
    let data = await this.mds.get('favourites');
    //If there are no favourites yet, count is 0
    if (data == null) {
      this.favouritesCount = 0;
    } else {
      this.favouritesCount = data.length;
    }
  }

  //Open the recent searches dropdown when searchbar gets focus
  openRecentSearches() {
    this.showRecentSearches = true;
  }

  //Close the recent searches dropdown when searchbar loses focus
  closeRecentSearches() {
    //Small delay so the click on a recent search registers before the dropdown closes
    setTimeout(() => {
      this.showRecentSearches = false;
    }, 200);
  }

  //Search movies using the text entered by the user
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
    this.showRecentSearches = false;
    this.searchMovies();
  }

  //Reset search and show trending movies again
  backToTrending() {
    this.searchText = '';
    this.showRecentSearches = false;
    this.getTrendingMovies();
  }

  //Navigate to movie details page passing the movie id
  goToMovieDetails(movie: any) {
    this.router.navigate(['/movie-details', movie.id]);
  }

  //Navigate to favourites page
  goToFavourites() {
    this.router.navigate(['/favourites']);
  }

}