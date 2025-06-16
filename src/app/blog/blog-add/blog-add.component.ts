import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../blog.service';
import { Blog } from '../../class/blog';
import Quill from 'quill';

@Component({
  selector: 'app-blog-add',
  standalone:false,
  templateUrl: './blog-add.component.html',
  styleUrls: ['./blog-add.component.css']
})
export class BlogAddComponent {
  blog: Blog = new Blog('', '', '', new Date(), '', '', '');
  blogTitle: string = '';
  blogContent: string = '';
  blogImage: string | ArrayBuffer | null = null;
  createdAt: Date = new Date();
  showPopup: boolean = false;
  blogData: Blog | null = null;
  category: string = '';
  author: string = ''; // Biến author sẽ lưu username của admin đang đăng nhập

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  constructor(
    private router: Router,
    private blogService: BlogService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { blogData?: Blog };
    if (state?.blogData) {
      this.blogData = state.blogData;
      this.blog = state.blogData;
      this.blogTitle = state.blogData.title;
      this.blogContent = state.blogData.content;
      this.category = state.blogData.category;

      if (state.blogData.thumbnail) {
        this.blogImage = state.blogData.thumbnail;
      }

      this.createdAt = new Date(state.blogData.published_at);
    }

    // Lấy username của admin đang đăng nhập từ localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.author = user.username; // Gán username vào biến author
    }
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.blogImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveBlog(): void {
    if (!this.blogTitle.trim() || !this.blogContent.trim() || !this.blogImage) {
      this.showPopup = true;
      return;
    }

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      alert('Vui lòng đăng nhập lại để tiếp tục.');
      this.router.navigate(['/login']);
      return;
    }

    // Tạo đối tượng blog mới
    const newBlog: Blog = {
      _id: this.blogData?._id || '',
      title: this.blogTitle,
      content: this.blogContent,
      published_at: this.createdAt,
      category: this.category,
      thumbnail: this.blogImage as string,
      author: this.author // Gán username vào author
    };

    // Gọi API để thêm hoặc cập nhật blog
    if (this.blogData) {
      this.blogService.updateBlog(this.blogData._id, newBlog, token).subscribe(
        () => {
          this.router.navigate(['/blog']);
        },
        (error) => {
          console.error('Error updating blog:', error);
        }
      );
    } else {
      this.blogService.createBlog(newBlog, token).subscribe(
        () => {
          this.router.navigate(['/blog']);
        },
        (error) => {
          console.error('Error creating blog:', error);
        }
      );
    }
  }

  closePopup(): void {
    this.showPopup = false;
  }

  cancel(): void {
    this.router.navigate(['/blog']);
  }
}