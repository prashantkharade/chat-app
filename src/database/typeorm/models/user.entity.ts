import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    Name: string;

    @CreateDateColumn({ type: 'timestamptz' })
    CreatedAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    UpdatedAt: Date;

}
