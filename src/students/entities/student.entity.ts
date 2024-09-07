import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({name: "students"})
export class Student {

    @PrimaryGeneratedColumn("uuid")
    student_id: string

    @Column({type: "varchar", length: 255})
    name: string 


}
 