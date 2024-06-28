import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity("logs")
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    level: string;

    @Column()
    message: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ nullable: true })
    meta?: string;
}
