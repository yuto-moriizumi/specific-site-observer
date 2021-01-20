-- MySQL Script generated by MySQL Workbench
-- Thu Jan 21 02:51:28 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`artists`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`artists` (
  `url` VARCHAR(511) NOT NULL,
  `last_title` VARCHAR(255) NULL,
  `last_img` VARCHAR(511) NULL,
  `updated` DATETIME NULL,
  `name` VARCHAR(127) NULL,
  PRIMARY KEY (`url`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`subscriptions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`subscriptions` (
  `user_id` VARCHAR(511) NOT NULL,
  `url` VARCHAR(511) NOT NULL,
  `rank` INT NULL DEFAULT 0,
  `has_new` TINYINT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`, `url`),
  INDEX `fk_User_has_Page_Page1_idx` (`url` ASC) VISIBLE,
  CONSTRAINT `fk_User_has_Page_Page1`
    FOREIGN KEY (`url`)
    REFERENCES `mydb`.`artists` (`url`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
