import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-add',
  standalone: false,
  templateUrl: './blog-add.component.html',
  styleUrls: ['./blog-add.component.css']
})
export class BlogAddComponent {
  blogTitle: string = ''; // Tiêu đề bài viết
  blogContent: string = ''; // Nội dung bài viết
  blogImage: string | ArrayBuffer | null = null; // Ảnh bìa
  createdAt: Date = new Date(); // Ngày tạo
  showPopup: boolean = false; // Kiểm soát hiển thị pop-up

  constructor(private router: Router) {}

  editorModules = {
    toolbar: false
  };

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.blogImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  formatText(command: string) {
    document.execCommand(command, false, '');
  }

  insertImage() {
    const url = prompt('Nhập URL hình ảnh:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  }

  saveBlog() {
    if (!this.blogTitle.trim() || !this.blogContent.trim() || !this.blogImage) {
      this.showPopup = true; // Hiển thị pop-up nếu thiếu nội dung
      return;
    }

    const newBlog = {
      id: Date.now(),
      title: this.blogTitle,
      content: this.blogContent,
      image: this.blogImage,
      date: this.createdAt
    };

    const blog = JSON.parse(localStorage.getItem('blog') || '[]');
    blog.unshift(newBlog);
    localStorage.setItem('blog', JSON.stringify(blog));

    this.router.navigate(['/blog']);
  }

  closePopup() {
    this.showPopup = false;
  }

  cancel() {
    this.router.navigate(['/blog']);
  }
}
