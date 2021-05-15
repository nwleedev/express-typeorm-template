import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleCategory } from './ArticleCategory';
import { ArticleSource } from './ArticleSource';
import { Post } from './Post';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    unique: true,
  })
  link: string;

  @Column()
  desc: string;

  @Column({
    nullable: true,
  })
  content: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column()
  author: string;

  @Column({
    name: 'published_at',
  })
  publishedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany((type) => Post, (post) => post.article, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: Post[];

  @ManyToOne((type) => ArticleCategory, (category) => category.article, {
    cascade: true,
  })
  category: ArticleCategory;

  @ManyToOne((type) => ArticleSource, (category) => category.source, {
    cascade: true,
  })
  source: ArticleSource;
}
