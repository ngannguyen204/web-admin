export class Blog {
  _id: string;
  title: string;
  content: string;
  published_at: Date;
  category: string;
  thumbnail: string; // Thay đổi từ thumnail thành thumbnail
  author: string; // Thay đổi từ authorId và authorName thành author

  constructor(
    _id: string,
    title: string,
    content: string,
    published_at: Date,
    category: string,
    thumbnail: string,
    author: string
  ) {
    this._id = _id;
    this.title = title;
    this.content = content;
    this.published_at = published_at;
    this.category = category;
    this.thumbnail = thumbnail;
    this.author = author;
  }
}