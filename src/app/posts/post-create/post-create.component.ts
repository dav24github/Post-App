import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  initForm: boolean = true;

  constructor(private postsSevice: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      this.initForm = false;
      return;
    }
    const post: Post = {
      id: '',
      title: form.value.title,
      content: form.value.content,
    };

    this.postsSevice.addPost(post);
    this.initForm = true;
    form.resetForm();
  }
}
