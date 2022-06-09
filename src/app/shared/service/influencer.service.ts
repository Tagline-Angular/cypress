import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfluencerService {

  constructor(private firestore: AngularFirestore, private http: HttpClient) { }

  public addInfluencer(influencerDetails: any) {
    return this.firestore
      .collection("Influencers", (ref) => ref.orderBy("date", "desc"))
      .add(influencerDetails);
  }

  public getAllInfluencers() {
    return this.firestore
      .collection("Influencers", (ref) => ref.orderBy("createdDate", "desc"))
      .snapshotChanges();
  }

  public addInfluencerLink(id:string,details:any){
    return this.firestore.collection("Influencers").doc(id).update(details);
  }

  public getInfluencer(id: string) {
    return this.firestore
      .collection("Influencers", (ref) => ref.where('__name__', '==', id))
      .snapshotChanges()
  }

  public createInfluencerLink(data: any) {
    const api_key = environment.firebaseConfig.apiKey;
    return this.http.post(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${api_key}`,
      {
        dynamicLinkInfo: data.dynamicLinkInfo, suffix: data.suffix
      })
  }

  public deleteInfluencer(id:string){
    const basePath = this.firestore.collection("Influencers").doc(id);
    return basePath.ref.delete();
  }
}
