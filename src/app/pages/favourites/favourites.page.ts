import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonListHeader, IonItem, IonLabel, IonThumbnail } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { MyDataService } from '../../services/my-data.service';
import { addIcons } from 'ionicons';
import { home } from 'ionicons/icons';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonListHeader, IonItem, IonLabel, IonThumbnail]
})
export class FavouritesPage implements OnInit {

  //List of favourite movies loaded from storage
  favourites: any[] = [];

  constructor(private router: Router, private mds: MyDataService) {
    addIcons({ home });
  }

  //Runs once when the page is created
  ngOnInit() {
  }

  //Runs every time the user enters this page
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

  //Remove all favourite movies after asking for confirmation
  async clearAllFavourites() {
    //Ask the user for confirmation before deleting everything
    let confirmation = confirm('Are you sure you want to remove all favourites?');
    if (confirmation == false) {
      return;
    }

    //Empty the favourites list and save to storage
    this.favourites = [];
    await this.mds.set('favourites', []);
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