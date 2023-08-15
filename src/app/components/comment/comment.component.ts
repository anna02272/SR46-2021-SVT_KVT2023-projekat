import { Component, Input } from '@angular/core';
import { UserService } from '../../services';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import {RefreshService } from '../../services/refresh.service';
import { Post } from '../../models/post';
import { DatePipe } from '@angular/common';
import { ReportComponent } from '../report/report.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
    providers: [DatePipe]
})

export class CommentComponent {
  @Input() postId!: number;
  comments: Comment[] = [];
  parentComment = new Comment(0, '', new Date(), false, this.userService.currentUser);
  comment = new Comment(0,'',new Date(),false, this.userService.currentUser, this.parentComment);
  @Input() post!: Post;
  editingCommentId: number | null = null;
  replyingCommentId: number | null = null;
  newCommentText: string = '';
  replyCommentText: string = '';
  showReplyForm!: boolean;
  sortingOrder: string = 'ascending';

  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private refreshService: RefreshService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {  this.showReplyForm = false;}

  ngOnInit() {
    this.load();
    this.subscribeToRefresh();
  }

  onSubmit() {
      this.create();
  }

  onSubmitUpdate(comment: Comment) {
    this.update(comment);
  }
  
  create() {
    if (this.post.id !== undefined) {
      let newComment: Comment;
      if (this.parentComment.id) {
        newComment = new Comment(  0, this.replyCommentText, new Date(),false, this.userService.currentUser, this.parentComment  );
      } else {
        newComment = new Comment( 0, this.newCommentText,  new Date(),  false, this.userService.currentUser );
      }
  
      this.commentService.create(this.post.id, newComment).subscribe(() => {
        this.refreshService.refresh();
        if (this.parentComment.id) { this.replyCommentText = '';  this.showReplyForm = false;
         this.parentComment = new Comment( 0, '', new Date(), false, this.userService.currentUser );
        } else {
          this.newCommentText = '';

        }
      });
    }
  }

  update(comment: Comment) {
    this.commentService.update(comment.id, comment).subscribe(() => {
      this.refreshService.refresh();
    });
  }

    edit(comment: Comment): void {
      this.comment = { ...comment }; 
      this.editingCommentId = comment.id;
    }

    delete(comment: Comment): void {
      this.commentService.delete(comment.id).subscribe(() => {
        this.comments = this.comments.filter(p => p.id !== comment.id);
        this.refreshService.refresh();
      });
    }
    reply(comment: Comment) {
      if (this.replyingCommentId === comment.id) {
        this.showReplyForm = !this.showReplyForm;
      } else {
        this.parentComment = comment;
        this.replyingCommentId = comment.id;
        this.showReplyForm = true;
      }
    }
     
    // load() {
    //   if (this.post && this.post.id) {
    //     this.commentService.getCommentsByPostId(this.post.id).subscribe((data: Comment[]) => {
    //       this.comments = data;
    //     });
    //   } else {
    //     this.comments = [];
    //   }
    // }

  load() {
    if (this.post && this.post.id) {
      if (this.sortingOrder === 'ascending') {
        this.commentService.getAllAscending(this.post.id).subscribe((data: Comment[]) => {
          this.comments = data;
        });
      } else if (this.sortingOrder === 'descending') {
        this.commentService.getAllDescending(this.post.id).subscribe((data: Comment[]) => {
          this.comments = data;
        });
      } else if (this.sortingOrder === 'likesAscending') {
        this.commentService.getAllByAscendingLikes(this.post.id).subscribe((data: Comment[]) => {
          this.comments = data;
        });
      } else if (this.sortingOrder === 'likesDescending') {
        this.commentService.getAllByDescendingLikes(this.post.id).subscribe((data: Comment[]) => {
          this.comments = data;
        });
      } else if (this.sortingOrder === 'dislikesAscending') {
        this.commentService.getAllByAscendingDislikes(this.post.id).subscribe((data: Comment[]) => {
          this.comments = data;
        });
      } else if (this.sortingOrder === 'dislikesDescending') {
        this.commentService.getAllByDescendingDislikes(this.post.id).subscribe((data: Comment[]) => {
          this.comments = data;
        });
      } else if (this.sortingOrder === 'heartsAscending') {
        this.commentService.getAllByAscendingHearts(this.post.id).subscribe((data: Comment[]) => {
          this.comments = data;
        });
      } else if (this.sortingOrder === 'heartsDescending') {
        this.commentService.getAllByDescendingHearts(this.post.id).subscribe((data: Comment[]) => {
          this.comments = data;
        });
      }
    } else {
      this.comments = [];
    }
  }
  
  toggleSortingOrder(sortOption: string) {
    if (sortOption === 'date') {
      this.sortingOrder = this.sortingOrder === 'ascending' ? 'descending' : 'ascending';
    } else if (sortOption === 'likes') {
      this.sortingOrder = this.sortingOrder === 'likesAscending' ? 'likesDescending' : 'likesAscending';
    } else if (sortOption === 'dislikes') {
      this.sortingOrder = this.sortingOrder === 'dislikesAscending' ? 'dislikesDescending' : 'dislikesAscending';
    } else if (sortOption === 'hearts') {
      this.sortingOrder = this.sortingOrder === 'heartsAscending' ? 'heartsDescending' : 'heartsAscending';
    }
    this.load();
  }
  openReportModal(comment: Comment) {
    const dialogRef = this.dialog.open(ReportComponent, {
      width: '500px', 
      data: { commentId: comment.id },
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  
    private subscribeToRefresh() {
      this.refreshService.getRefreshObservable().subscribe(() => {
        this.load();
      });
    }

    hasSignedIn() {
      return !!this.userService.currentUser;
    }
  
    userName() {
      const user = this.userService.currentUser;
      return user ? user.username : '';
    }
    userType() {
      const user = this.userService.currentUser;
      return user ? user.type : '';
    }
    formatDate(date: any): string {
    const [year, month, day] = date;
    const formattedDate = new Date(year, month - 1, day);
    return this.datePipe.transform(formattedDate, 'dd/MM/yyyy') || '';
  }
  }