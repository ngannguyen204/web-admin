import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-blog',
  standalone: false,
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  blogs = [
    { id: 1, title: "7 loại kính hot nhất 2025", date: "October 16, 2024", image: "assets/blog1.jpg" },
    { id: 2, title: "Chất liệu kính mắt tự chữa lành", date: "October 16, 2023", image: "assets/blog2.jpg" },
    { id: 3, title: "Gọng kính không chỉ còn là gọng", date: "October 16, 2024", image: "assets/blog3.jpg" },
    { id: 4, title: "Mẫu kính đạt giải Oscar", date: "October 16, 2024", image: "assets/blog4.jpg" },
    { id: 5, title: "COLLAB đạt giải hãng kính của năm", date: "October 16, 2023", image: "assets/blog5.jpg" },
    { id: 6, title: "Xu hướng chụp hình với kính", date: "October 16, 2023", image: "assets/blog6.jpg" },
    { id: 7, title: "Kính tròn cổ điển trở lại", date: "October 17, 2024", image: "assets/blog7.jpg" },
    { id: 8, title: "Kính phân cực có gì đặc biệt?", date: "October 17, 2023", image: "assets/blog8.jpg" },
    { id: 9, title: "Sự kết hợp giữa thời trang và công nghệ", date: "October 18, 2024", image: "assets/blog9.jpg" },
    { id: 10, title: "Làm thế nào để chọn kính phù hợp?", date: "October 18, 2023", image: "assets/blog10.jpg" },
    { id: 11, title: "Kính xanh chống ánh sáng xanh", date: "October 19, 2024", image: "assets/blog11.jpg" },
    { id: 12, title: "Xu hướng kính thời trang 2025", date: "October 19, 2023", image: "assets/blog12.jpg" }
  ];

  showAll = false;
  currentPage = 1;
  itemsPerPage = 6;
  Math = Math;

  constructor(private router: Router) {}

  toggleAllBlogs() {
    this.showAll = !this.showAll;
    this.itemsPerPage = this.showAll ? 12 : 6;  // 3 cột x 4 hàng khi mở rộng
    this.currentPage = 1; // Reset trang về đầu tiên khi đổi chế độ
  }

  get paginatedBlogs() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.blogs.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.blogs.length / this.itemsPerPage)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  editBlog(blogId: number) {
    this.router.navigate(['/blog-edit', blogId]);
  }

  navigateToAddBlog() {
    this.router.navigate(['/blog-add']);
  }
}
