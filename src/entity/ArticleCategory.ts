import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './Article';

@Entity()
export class ArticleCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @OneToMany((type) => Article, (article) => article.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  article: Article[];
}
