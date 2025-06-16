import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../blog.service';
import { Blog } from '../class/blog';

@Component({
  selector: 'app-blog',
  standalone:false,
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogs: Blog[] = [];
  showAll = false;
  currentPage = 1;
  itemsPerPage = 5;
  showConfirmDelete = false;
  selectedBlog: Blog | null = null;

  constructor(
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.fetchBlogs();
  }
  
  fetchBlogs(): void {
    this.blogService.getBlogs().subscribe(
      (data) => {
        this.blogs = data.map(blog => new Blog(
          blog._id,
          blog.title,
          blog.content,
          new Date(blog.published_at),
          blog.category,
          blog.thumbnail,
          blog.author // Lấy trực tiếp author từ dữ liệu database
        ));
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }

  confirmDelete(blog: Blog): void {
    this.showConfirmDelete = true;
    this.selectedBlog = blog;
  }

  hideDeletePopup(): void {
    this.showConfirmDelete = false;
    this.selectedBlog = null;
  }

  deleteBlog(): void {
    if (this.selectedBlog) {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (!token) {
        console.error('No token found');
        return;
      }

      this.blogService.deleteBlog(this.selectedBlog._id, token).subscribe(
        () => {
          this.blogs = this.blogs.filter(b => b._id !== this.selectedBlog!._id);
          this.hideDeletePopup();
        },
        (error) => {
          console.error('Error deleting blog:', error);
        }
      );
    }
  }

  toggleAllBlogs(): void {
    this.showAll = !this.showAll;
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.blogs.length / this.itemsPerPage);
  }

  get paginatedBlogs(): Blog[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.blogs.slice(start, start + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  navigateToAddBlog(): void {
    this.router.navigate(['/blog-add']);
  }

  openEditBlog(blog: Blog): void {
    this.router.navigate(['/blog-add'], { state: { blogData: blog } });
  }
}