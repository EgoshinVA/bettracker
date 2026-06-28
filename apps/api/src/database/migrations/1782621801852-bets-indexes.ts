import { MigrationInterface, QueryRunner } from 'typeorm'

export class BetsIndexes1782621801852 implements MigrationInterface {
  name = 'BetsIndexes1782621801852'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Analytics queries filter/sort by createdAt, result, and sport on every request.
    // Without these indexes, every analytics call does a full seq scan on the bets table.
    await queryRunner.query(`CREATE INDEX "IDX_bets_createdAt" ON "bets" ("createdAt")`)
    await queryRunner.query(`CREATE INDEX "IDX_bets_result" ON "bets" ("result")`)
    await queryRunner.query(`CREATE INDEX "IDX_bets_sport" ON "bets" ("sport")`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_bets_sport"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_bets_result"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_bets_createdAt"`)
  }
}
