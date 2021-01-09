import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity';
import { BookType } from '../enum/BookType';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ type: 'varchar', nullable: false }) title: string;
  @Column({ type: 'varchar', nullable: false }) author: string;
  @Column({ type: 'varchar', nullable: true }) isbn: string;
  @Column({ type: 'varchar', nullable: true }) description: string;
  @Column({ type: 'bytea', nullable: true }) image: string;
  @Column({
    type: 'simple-enum',
    enum: BookType,
    enumName: 'BookType',
    nullable: true,
  })
  bookType?: BookType;
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  ownerId: number;
  @Column({ type: 'varchar', nullable: false }) filename: string;
  @Column({ type: 'varchar', nullable: false }) originalname: string;
  @Column({ type: 'integer', nullable: false }) size: number;
  @Column({ type: 'varchar', nullable: false }) mimetype: string;
  @CreateDateColumn() createdOn?: Date;
  @CreateDateColumn() updatedOn?: Date;
}
