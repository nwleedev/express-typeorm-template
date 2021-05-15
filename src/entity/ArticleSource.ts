import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './Article';

@Entity()
export class ArticleSource extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  source: string;

  @OneToMany((type) => Article, (article) => article.source, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  article: Article[];
}
