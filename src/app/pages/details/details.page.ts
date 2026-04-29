import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/angular/standalone';
import { HttpOptions } from '@capacitor/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyHttpService } from 'src/app/services/my-http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonListHeader, CommonModule, FormsModule]
})
export class DetailsPage implements OnInit {

  person: any;                                          //Person data (cast or crew member)
  movies: any[] = [];                                   //Array to store the movies the person has been in
  apiKey: string = '04b4a3b05536f796e2be2bb50fb5c234';  //API key to authenticate requests to TMDB


  constructor(private mhs: MyHttpService, private route: ActivatedRoute, private router: Router) { }

  //Runs once when the page is created, reads the person id from the URL
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getPersonDetails(id);
    this.getPersonMovies(id);
  }

  //Call web page to get details of selected person
  async getPersonDetails(id: number) {
    const options: HttpOptions = {
      url: `https://api.themoviedb.org/3/person/${id}?api_key=${this.apiKey}`
    };
    this.person = await this.mhs.get(options);
  }

  //Call web page to get the movies of selected person
  async getPersonMovies(id: number) {
    const options: HttpOptions = {
      url: `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${this.apiKey}`
    };
    const data = await this.mhs.get(options);
    this.movies = data.cast;
  }

  //Navigate to Movie Details page for the selected movie
  goToMovieDetails(movie: any) {
    this.router.navigate(['/movie-details', movie.id]);
  }

}