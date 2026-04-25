import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpOptions } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import { MyHttpService } from 'src/app/services/my-http.service';
import { MyDataService } from 'src/app/services/my-data.service';
import { IonButtons, IonButton, IonIcon, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, heart } from 'ionicons/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, CommonModule, FormsModule]
})
export class MovieDetailsPage implements OnInit {

  //Movie data received from Home Page
  movie: any;

  //Array to store the cast members
  cast: any[] = [];

  //Array to store the crew members
  crew: any[] = [];

  //API key to authenticate requests to TMDB
  apiKey: string = '04b4a3b05536f796e2be2bb50fb5c234';

  //Variable to track if the movie is a favourite
  favourite: boolean = false;

  constructor(private mhs: MyHttpService, private mds: MyDataService, private route: ActivatedRoute, private router: Router) {
    addIcons({ home, heart });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getMovieDetails(id);
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

  //Navigate to Home page
  goToHome() {
    this.router.navigate(['/home']);
  }

  //Navigate to Favourites page
  goToFavourite() {
    this.router.navigate(['/favourites']);
  }

  //Add the movie to the favourites list
  async addToFavourites() {
    //Get the current favourites list (or empty array if none)
    let favourites = await this.mds.get('favourites') || [];

    //Add the current movie to the list
    favourites.push(this.movie);

    //Save the updated list
    await this.mds.set('favourites', favourites);

    //Change status of favourite
    this.favourite = true;
  }

  //Remove the movie from the favourites list
  async removeFromFavourites() {
    //Get the current favourites list
    let favourites = await this.mds.get('favourites') || [];

    //Loop through the list and find the movie to remove
    for (let i = 0; i < favourites.length; i++) {
      if (favourites[i].id == this.movie.id) {
        favourites.splice(i, 1);
        break;
      }
    }
    //Save the updated list
    await this.mds.set('favourites', favourites);
    //Change status of favourite
    this.favourite = false;
  }

  //Confirm if the movie is already a favourite
  async isFavourite() {
    //Get the current favourites list
    let favourites = await this.mds.get('favourites') || [];

    //Loop through the list and check if the current movie is there
    for (let i = 0; i < favourites.length; i++) {
      if (favourites[i].id == this.movie.id) {
        return true;
      }
    }

    return false;
  }

  //Update the favourite status
  async checkFavourite() {
    this.favourite = await this.isFavourite();
  }

  //Navigate to Details page for the selected cast or crew member
  goToDetails(person: any) {
    console.log('Going to details with person:', person);
    this.router.navigate(['/details', person.id]);
  }
}