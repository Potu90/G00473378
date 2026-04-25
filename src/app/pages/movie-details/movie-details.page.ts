import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpOptions } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import { MyHttpService } from 'src/app/services/my-http.service';
import { MyDataService } from 'src/app/services/my-data.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
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

  constructor(private mhs: MyHttpService, private mds: MyDataService, private route: ActivatedRoute) { }

  ngOnInit() {
    //Get the movie id from the URL and call the API
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
  }

  //Navigate to Home page
  goToHome() {

  }

  //Navigate to Favourites page
  goToFavourite() {

  }

  //Confirm if the movie is already a favourite
  isFavourite() {

  }

  //Add the movie to the favourites list
  addToFavourites() {

  }

  //Remove the movie from the favourites list
  removeFromFavourites() {

  }

  //Navigate to Details page for the selected cast or crew member
  goToDetails() {

  }
}