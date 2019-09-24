USE 'fengti';

CREATE TABLE `fengti`.`feedback`( `no` BIGINT NOT NULL AUTO_INCREMENT, `event_id` BIGINT, `user_id` BIGINT, `comment` TEXT, PRIMARY KEY (`no`) ) CHARSET=utf8 COLLATE=utf8_general_ci;