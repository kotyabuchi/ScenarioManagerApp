CREATE TABLE `game_schedules` (
	`session_id` text PRIMARY KEY NOT NULL,
	`schedule_date` integer NOT NULL,
	`schedule_phase` text DEFAULT 'ADJUSTING' NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `game_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`scenario_id` text NOT NULL,
	`session_phase` text DEFAULT 'RECRUITING' NOT NULL,
	`keeper_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`keeper_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scenario_tags` (
	`scenario_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`scenario_id`, `tag_id`),
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`author` text,
	`description` text,
	`short_description` text,
	`scenario_image` text,
	`min_player` integer,
	`max_player` integer,
	`min_playtime` integer,
	`max_playtime` integer,
	`handout_type` text DEFAULT 'NONE' NOT NULL,
	`distribute_url` text,
	`created_by_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `session_participants` (
	`session_id` text NOT NULL,
	`user_id` text NOT NULL,
	`player_type` text DEFAULT 'PLAYER' NOT NULL,
	`player_state` text DEFAULT 'PENDING' NOT NULL,
	`character_sheet_url` text,
	PRIMARY KEY(`session_id`, `user_id`),
	FOREIGN KEY (`session_id`) REFERENCES `game_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text
);
--> statement-breakpoint
CREATE TABLE `user_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`scenario_id` text NOT NULL,
	`session_id` text,
	`open_comment` text,
	`spoiler_comment` text,
	`rating` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_id`) REFERENCES `game_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_scenario_preferences` (
	`scenario_id` text NOT NULL,
	`user_id` text NOT NULL,
	`session_id` text,
	`is_played` integer NOT NULL,
	`is_watched` integer NOT NULL,
	`can_keeper` integer NOT NULL,
	`had_scenario` integer NOT NULL,
	`is_like` integer NOT NULL,
	PRIMARY KEY(`scenario_id`, `user_id`),
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_id`) REFERENCES `game_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`discord_id` text NOT NULL,
	`user_name` text NOT NULL,
	`nickname` text NOT NULL,
	`password` text NOT NULL,
	`password_salt` text NOT NULL,
	`bio` text,
	`avatar` text,
	`role` text DEFAULT 'MEMBER' NOT NULL,
	`lastlogin_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `video_links` (
	`id` text PRIMARY KEY NOT NULL,
	`scenario_id` text NOT NULL,
	`session_id` text NOT NULL,
	`video_url` text NOT NULL,
	`created_by_id` text NOT NULL,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_id`) REFERENCES `game_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_schedules_session_id_unique` ON `game_schedules` (`session_id`);--> statement-breakpoint
CREATE INDEX `game_schedules_date_idx` ON `game_schedules` (`schedule_date`);--> statement-breakpoint
CREATE INDEX `game_sessions_scenario_idx` ON `game_sessions` (`scenario_id`);--> statement-breakpoint
CREATE INDEX `game_sessions_keeper_idx` ON `game_sessions` (`keeper_id`);--> statement-breakpoint
CREATE INDEX `scenarios_name_idx` ON `scenarios` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE INDEX `user_reviews_scenario_idx` ON `user_reviews` (`scenario_id`);--> statement-breakpoint
CREATE INDEX `user_reviews_session_idx` ON `user_reviews` (`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_reviews_scenario_id_user_id_unique` ON `user_reviews` (`scenario_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `user_scenario_preferences_session_idx` ON `user_scenario_preferences` (`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_discord_id_unique` ON `users` (`discord_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_name_unique` ON `users` (`user_name`);--> statement-breakpoint
CREATE INDEX `users_discord_idx` ON `users` (`discord_id`);--> statement-breakpoint
CREATE INDEX `users_username_idx` ON `users` (`user_name`);--> statement-breakpoint
CREATE INDEX `users_nickname_idx` ON `users` (`nickname`);--> statement-breakpoint
CREATE UNIQUE INDEX `video_links_video_url_unique` ON `video_links` (`video_url`);--> statement-breakpoint
CREATE INDEX `video_links_scenario_idx` ON `video_links` (`scenario_id`);--> statement-breakpoint
CREATE INDEX `video_links_session_idx` ON `video_links` (`session_id`);