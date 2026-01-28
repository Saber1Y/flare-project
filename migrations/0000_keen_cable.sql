CREATE TABLE "proofs" (
	"id" serial PRIMARY KEY NOT NULL,
	"tx_hash" text NOT NULL,
	"receipt_id" text NOT NULL,
	"iso_type" text DEFAULT 'payment',
	"record_hash" text,
	"anchor_tx_hash" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"from_address" text NOT NULL,
	"to_address" text,
	"value" text NOT NULL,
	"block_number" integer NOT NULL,
	"timestamp" integer NOT NULL,
	"gas_used" text,
	"gas_price" text,
	"category" text DEFAULT 'uncategorized',
	"recorded" boolean DEFAULT false,
	"proof_id" text,
	"network" text DEFAULT 'coston2',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "transactions_hash_unique" UNIQUE("hash")
);
