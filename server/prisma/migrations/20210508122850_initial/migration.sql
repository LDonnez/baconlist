-- CreateTable
CREATE TABLE "friend_requests" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiver_id" UUID NOT NULL,
    "requester_id" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "friend_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token_states" (
    "id" UUID NOT NULL,
    "user_agent" VARCHAR NOT NULL,
    "revoked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests.receiver_id_unique" ON "friend_requests"("receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests.requester_id_unique" ON "friend_requests"("requester_id");

-- CreateIndex
CREATE INDEX "IDX_781744f1014838837741581a8b" ON "friend_requests"("receiver_id");

-- CreateIndex
CREATE INDEX "IDX_9a4e62994c6be786cd48cc5255" ON "friend_requests"("requester_id");

-- CreateIndex
CREATE UNIQUE INDEX "friends.user_id_unique" ON "friends"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "friends.friend_id_unique" ON "friends"("friend_id");

-- CreateIndex
CREATE INDEX "IDX_c9d447f72456a67d17ec30c5d0" ON "friends"("friend_id");

-- CreateIndex
CREATE INDEX "IDX_f2534e418d51fa6e5e8cdd4b48" ON "friends"("user_id");

-- CreateIndex
CREATE INDEX "IDX_47b9e0ffdd6f9e04a6985a99eb" ON "refresh_token_states"("user_id");

-- CreateIndex
CREATE INDEX "IDX_df996151961d1c2444a0fcf0cc" ON "refresh_token_states"("user_agent");

-- CreateIndex
CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users"("email");

-- AddForeignKey
ALTER TABLE "friend_requests" ADD FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token_states" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
