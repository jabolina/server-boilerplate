import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar", { length: 30 })
    firstName!: string;

    @Column("varchar", { length: 255, unique: true })
    email!: string;

    @Column("text")
    password!: string;
}
