import { Entity, Column, PrimaryColumn, BeforeInsert, BaseEntity } from "typeorm";
import * as uuid4 from "uuid/v4";

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn("uuid")
    id: string;

    @Column("varchar", { length: 30 })
    firstName: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("text")
    password: string;

    @BeforeInsert()
    generateId() {
        this.id = uuid4();
    }

}
