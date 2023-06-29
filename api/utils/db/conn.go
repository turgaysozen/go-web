package db

import (
	"fmt"
	"os"

	"github.com/remote-job-finder/api/utils/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	DB *gorm.DB
}

func InitDB() (*Database, error) {
	// Load env variables and establish the database connection
	host := os.Getenv("POSTGRES_HOST")
	port := os.Getenv("POSTGRES_PORT")
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB_NAME")
	sslMode := os.Getenv("POSTGRES_SSL_MODE")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbName, sslMode,
	)
	gormDB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Create the Database struct
	db := &Database{
		DB: gormDB,
	}

	// Migrate all of structs
	models := []interface{}{
		Job{},
		Company{},
		Category{},
		Source{},
	}

	// Migrate all models and print success message after all of them complete
	migrationSuccess := true
	for _, model := range models {
		err = db.DB.AutoMigrate(model)
		if err != nil {
			migrationSuccess = false
			return nil, err
		}
	}

	if migrationSuccess {
		logger.Info.Println("All migrations completed successfully")
	} else {
		logger.Error.Println("Some migrations failed, check logs for details")
	}

	// Send initial data to db
	if err := db.CreateInitialSource(); err != nil {
		logger.Error.Println("An error occurred while sending initial source data to db, err:", err)
		return nil, err
	}

	// Uncomment if you need to remove a field in db after deleting from the model
	// err = db.DB.Migrator().DropColumn(&Job{}, "source_type")
	// if err != nil {
	// 	panic("failed to delete field from the model")
	// }

	return db, nil
}
