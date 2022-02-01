import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BANCKEND_URL = environment.apiUrl + 'posts/';

@Injectable({ providedIn: 'root' })
// @Injectable()
export class PostsService {
  private posts!: Post[];
  private postsUpdated = new Subject<{ post: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BANCKEND_URL + queryParams
      )
      .pipe(
        map((PostData) => {
          return {
            posts: PostData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: PostData.maxPosts,
          };
        })
      )
      .subscribe((transformedPosts) => {
        console.log(transformedPosts);
        this.posts = transformedPosts.posts;

        this.postsUpdated.next({
          post: [...this.posts],
          postCount: transformedPosts.maxPosts,
        });
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BANCKEND_URL + id);
  }

  addPost(title: string, content: string, image: File, imageData: any): void {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    postData.append('imageData', imageData);

    console.log(imageData);
    this.http
      .post<{ message: string; post: Post }>(BANCKEND_URL, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string,
    imageData: any
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('id', id);
      postData.append('content', content);
      postData.append('image', image, title);
      postData.append('imageData', imageData);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(BANCKEND_URL + id, postData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deletPost(postId: string) {
    return this.http.delete(BANCKEND_URL + postId);
  }
}
