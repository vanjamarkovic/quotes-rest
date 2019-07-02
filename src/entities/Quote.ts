import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Comment } from './Comment';

@Entity("quote")
export class Quote {

    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number;

    @Column({
        name: 'quote_by',
        nullable: false,
        length: 100
    })
    quoteBy: string;

    @Column({
        name: 'quote_text',
        nullable: false,
        length: 1000
    })
    quoteText: string;

    @Column({
        name: 'quote_date',
        nullable: false
    })
    quoteDate: Date;

    @Column({
        name: 'image_path'
    })
    imagePath: string;

    @OneToMany(type => Comment, comment => comment.quote)
    comments: Comment[];
}