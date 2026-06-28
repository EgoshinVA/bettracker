import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1782621801851 implements MigrationInterface {
    name = 'Init1782621801851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookmakers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "shortName" character varying(10) NOT NULL, "color" character varying(7) NOT NULL DEFAULT '#7c3aed', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_f75b6ecebd5c6a9df57492e0b3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c551e73a99af74d8266ae02706" ON "bookmakers" ("userId") `);
        await queryRunner.query(`CREATE TYPE "public"."bets_bettype_enum" AS ENUM('moneyline', 'spread', 'over_under', 'parlay', 'btts')`);
        await queryRunner.query(`CREATE TYPE "public"."bets_result_enum" AS ENUM('WON', 'LOST', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "bets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sport" character varying NOT NULL, "league" character varying NOT NULL, "match" character varying NOT NULL, "odds" numeric(10,2) NOT NULL, "stake" numeric(10,2) NOT NULL, "betType" "public"."bets_bettype_enum" NOT NULL, "result" "public"."bets_result_enum" NOT NULL DEFAULT 'PENDING', "notes" text, "profit" numeric(10,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "bookmaker_id" uuid, CONSTRAINT "PK_7ca91a6a39623bd5c21722bcedd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ca8cf669d26fbfcc365a4811b2" ON "bets" ("userId") `);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userId" uuid NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isRevoked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4542dd2f38a61354a040ba9fd5" ON "refresh_tokens" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_610102b60fea1455310ccd299d" ON "refresh_tokens" ("userId") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TYPE "public"."users_subscriptionstatus_enum" AS ENUM('FREE', 'PRO', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "isEmailVerified" boolean NOT NULL DEFAULT false, "subscriptionStatus" "public"."users_subscriptionstatus_enum" NOT NULL DEFAULT 'FREE', "subscriptionExpiresAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "timezones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "offset" character varying NOT NULL, CONSTRAINT "UQ_8d649a4a3159efd07c37edfb618" UNIQUE ("code"), CONSTRAINT "PK_589871db156cc7f92942334ab7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "nativeName" character varying NOT NULL, CONSTRAINT "UQ_7397752718d1c9eb873722ec9b2" UNIQUE ("code"), CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "currencyId" uuid, "timezoneId" uuid, "languageId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e8cfb5b31af61cd363a6b6d7c25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b6202d1cacc63a0b9c8dac2abd" ON "user_preferences" ("userId") `);
        await queryRunner.query(`CREATE TABLE "sports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "isEsport" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_4fa1063d368e1fd68ea63c7d860" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_838312bddf12c427e3f66657ff" ON "sports" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_be96c1d313b6d198a17b08f4c6" ON "sports" ("slug") `);
        await queryRunner.query(`CREATE TABLE "exchange_rates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "currencyCode" character varying(10) NOT NULL, "usdRate" numeric(18,6) NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_33a614bad9e61956079d817ebe2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_13947299cc87284153777411fd" ON "exchange_rates" ("currencyCode") `);
        await queryRunner.query(`ALTER TABLE "bookmakers" ADD CONSTRAINT "FK_c551e73a99af74d8266ae02706c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_ca8cf669d26fbfcc365a4811b22" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_69f88d619ca4addfa3da3e26846" FOREIGN KEY ("bookmaker_id") REFERENCES "bookmakers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_526827d46f64e29d07c58e9bf08" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_a3e97b3023d916a4c2696fb0796" FOREIGN KEY ("timezoneId") REFERENCES "timezones"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_1113531e5ef6585556f3b1fbce0" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_1113531e5ef6585556f3b1fbce0"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_a3e97b3023d916a4c2696fb0796"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_526827d46f64e29d07c58e9bf08"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_69f88d619ca4addfa3da3e26846"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_ca8cf669d26fbfcc365a4811b22"`);
        await queryRunner.query(`ALTER TABLE "bookmakers" DROP CONSTRAINT "FK_c551e73a99af74d8266ae02706c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13947299cc87284153777411fd"`);
        await queryRunner.query(`DROP TABLE "exchange_rates"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be96c1d313b6d198a17b08f4c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_838312bddf12c427e3f66657ff"`);
        await queryRunner.query(`DROP TABLE "sports"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6202d1cacc63a0b9c8dac2abd"`);
        await queryRunner.query(`DROP TABLE "user_preferences"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP TABLE "timezones"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_subscriptionstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_610102b60fea1455310ccd299d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4542dd2f38a61354a040ba9fd5"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca8cf669d26fbfcc365a4811b2"`);
        await queryRunner.query(`DROP TABLE "bets"`);
        await queryRunner.query(`DROP TYPE "public"."bets_result_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bets_bettype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c551e73a99af74d8266ae02706"`);
        await queryRunner.query(`DROP TABLE "bookmakers"`);
    }

}
