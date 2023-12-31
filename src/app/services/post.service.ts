import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ConfigService} from './config.service';
import { Post } from '../models/post';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class PostService {

  constructor(
    private apiService: ApiService,
    private config: ConfigService,
    private http: HttpClient
    
  ) {
  }

  // createPost(post: Post){
  //   return this.apiService.post(this.config.post_url + "/create", post);
  // }
  createPost(postData: FormData) {
    const url = `${this.config.post_url}/create`;
    return this.http.post(url, postData);
  }
  createGroupPost(groupId: number,postData: FormData) {
    const url = `${this.config.post_url}/create/${groupId}`;
    return this.http.post(url, postData);
  }
  // createGroupPost(groupId: number, post: Post){
  //   const url = `${this.config.post_url}/create/${groupId}`;
  //    return this.apiService.post(url, post);
  //  }

  deletePost(id: number) {
  return this.apiService.put(this.config.post_url + '/delete/' + id);
}
// updatePost(postId: number, post: Post) {
//   const url = `${this.config.post_url}/update/${postId}`;
//   return this.apiService.put(url, post);
// }
updatePost(postId: number, postData: FormData) {
  const url = `${this.config.post_url}/update/${postId}`;
  return this.http.put(url, postData);
}

  getAllPosts() {
    return this.apiService.get(this.config.post_url + "/all");
   }
   getAllAscending() {
    return this.apiService.get(this.config.post_url + "/ascendingAll");
   }
   getAllDescending() {
    return this.apiService.get(this.config.post_url + "/descendingAll");
   }
   getPostById(id : number) {
    return this.apiService.get(this.config.post_url + "/find/" + id );
   }
   getByGroup(groupId: number) {
    return this.apiService.get(`${this.config.post_url}/all/${groupId}`);
  }
  getByGroupAsc(groupId: number) {
    return this.apiService.get(`${this.config.post_url}/allAsc/${groupId}`);
  }
  getByGroupDesc(groupId: number) {
    return this.apiService.get(`${this.config.post_url}/allDesc/${groupId}`);
  }
  deleteImage(id: number) {
    return this.apiService.delete(this.config.post_url + '/delete/' + id);
  }

}
