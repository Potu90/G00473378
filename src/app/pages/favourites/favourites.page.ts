import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MyDataService } from '../../services/my-data.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class FavouritesPage implements OnInit {

  //List of favourite movies loaded from storage
  favourites: any[] = [];

  constructor(private router: Router, private mds: MyDataService) { }

  ngOnInit() {
  }

  //Reload favourites every time the user enters this page
  async ionViewWillEnter() {
    await this.loadFavourites();
  }

  //Load favourites from Ionic Storage
  async loadFavourites() {
    let data = await this.mds.get('favourites');
    //If there are no favourites yet, use empty array
    if (data == null) {
      this.favourites = [];
    } else {
      this.favourites = data;
    }
  }

  //Navigate to Movie Details page
  goToMovieDetails(movie: any) {
    this.router.navigate(['/movie-details', movie.id]);
  }

  //Navigate back to Home page
  goToHome() {
    this.router.navigate(['/home']);
  }

}