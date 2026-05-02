import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonListHeader, IonList, IonBadge } from '@ionic/angular/standalone';
import { HttpOptions } from '@capacitor/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyHttpService } from 'src/app/services/my-http.service';
import { MyDataService } from 'src/app/services/my-data.service';
import { addIcons } from 'ionicons';
import { home, heart } from 'ionicons/icons';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonListHeader, IonList, IonBadge, CommonModule, FormsModule]
})
export class MovieDetailsPage implements OnInit {

  movie: any;                                           //Movie data received from Home Page
  cast: any[] = [];                                     //Array to store the cast members
  crew: any[] = [];                                     //Array to store the crew members
  favourite: boolean = false;                           //Variable to track if the movie is a favourite
  favouritesCount: number = 0;                          //Number of favourite movies, shown as a badge
  apiKey: string = '04b4a3b05536f796e2be2bb50fb5c234';  //API key to authenticate requests to TMDB


  constructor(private mhs: MyHttpService, private mds: MyDataService, private route: ActivatedRoute, private router: Router) {
    addIcons({ home, heart });
  }

  //Runs once when the page is created, reads the movie id from the URL
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getMovieDetails(id);
    this.loadFavouritesCount();
  }

  //Call web page to get movie details, cast and crew of selected movie
  async getMovieDetails(id: number) {
    //First call: get movie details (overview, title, poster)
    const movieOptions: HttpOptions = {
      url: `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`
    };
    this.movie = await this.mhs.get(movieOptions);

    //Second call: get cast and crew
    const creditsOptions: HttpOptions = {
      url: `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.apiKey}`
    };
    const data = await this.mhs.get(creditsOptions);
    this.cast = data.cast;
    this.crew = data.crew;

    //Check if this movie is in favourites after loading
    this.checkFavourite();
  }

  //Load the number of favourites from storage to show in the badge
  async loadFavouritesCount() {
    let data = await this.mds.get('favourites');
    //If there are no favourites yet, count is 0
    if (data === null) {
      this.favouritesCount = 0;
    } else {
      this.favouritesCount = data.length;
    }
  }

  //Confirm if the movie is already a favourite
  async isFavourite() {
    //Get the current favourites list
    let favourites = await this.mds.get('favourites') ?? [];

    //Loop through the list and check if the current movie is there
    for (let i = 0; i < favourites.length; i++) {
      if (favourites[i].id === this.movie.id) {
        return true;
      }
    }
    return false;
  }

  //Update the favourite status
  async checkFavourite() {
    this.favourite = await this.isFavourite();
  }

  //Add the movie to the favourites list
  async addToFavourites() {
    //Get the current favourites list (or empty array if none)
    let favourites = await this.mds.get('favourites') ?? [];

    //Add the current movie to the list
    favourites.push(this.movie);

    //Save the updated list
    await this.mds.set('favourites', favourites);

    //Change status of favourite
    this.favourite = true;

    //Refresh the badge count
    await this.loadFavouritesCount();
  }

  //Remove the movie from the favourites list
  async removeFromFavourites() {
    //Get the current favourites list
    let favourites = await this.mds.get('favourites') ?? [];

    //Loop through the list and find the movie to remove
    for (let i = 0; i < favourites.length; i++) {
      if (favourites[i].id === this.movie.id) {
        favourites.splice(i, 1);
        break;
      }
    }

    //Save the updated list
    await this.mds.set('favourites', favourites);

    //Change status of favourite
    this.favourite = false;

    //Refresh the badge count
    await this.loadFavouritesCount();
  }

  //Navigate to Details page for the selected cast or crew member
  goToDetails(person: any) {
    this.router.navigate(['/details', person.id]);
  }

  //Navigate to Home page
  goToHome() {
    this.router.navigate(['/home']);
  }

  //Navigate to Favourites page
  goToFavourite() {
    this.router.navigate(['/favourites']);
  }
}