import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Unique, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {compare, genSalt, hash} from 'bcrypt';
import config from 'config';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    constructor(data : { email: string, username: string, password: string } | undefined) {
      if (data) {
        this.email = data.email;
        this.username = data.username;
        this.password = data.password;
      }
    }

    private generateSalt() : Promise<string> {
      return new Promise<string>((resolve, reject) => {
        const saltRounds : number = config.get('saltRounds');
        genSalt(saltRounds || 10, (err, salt) => {
          if (err) return reject(err);
          resolve(salt);
        });
      });
    }

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword() : Promise<void> {
      const salt = await this.generateSalt();

      return new Promise<void>((resolve, reject) => {
        hash(this.password, salt, (err, hash) => {
          if (err) return reject(err);
          this.password = hash;
          resolve();
        });
      });
    }

    async comparePassword(password: string) : Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        compare(password, this.password, (err, matched) => {
          if (err) return reject(err);
          resolve(matched);
        });
      });
    }
}
