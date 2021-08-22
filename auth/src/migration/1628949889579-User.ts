import {MigrationInterface, QueryRunner} from 'typeorm';

export class User1628949889579 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user (
                id INT NOT NULL AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                PRIMARY KEY (id, email, username),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE user;
        `);
  }
}
