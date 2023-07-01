package db

import (
	"os"
	"strings"
	"time"

	"github.com/remote-job-finder/api/utils/logger"
	"gorm.io/gorm"
)

// Job Operations
//
// These functions provide operations related to managing job entities.
// They allow creating, retrieving, deleting, and listing jobs in the database.
// The job entities represent specific tasks or work assignments.
//
// Assumptions:
// - The database connection is established and available via the 'db' object.
//
// Usage:
// - Create a new job: CreateJob(job *Job) error
// - Retrieve a job by ID: GetJobByID(id uint) (*Job, error)
// - Delete all jobs: DeleteAllJobs() error
// - Get all active jobs: GetAllActiveJobsByCat() ([]Category, error)
// - Get all jobs by category ID: GetAllJobsByCatID(catID uint) ([]Job, error)
// - Increase application count +1: IncrementApplicant(slug string) error
// - Get application to fetch application count: GetApplication(slug string) (*Applicant, error)

func (db *Database) CreateJob(job *Job) error {
	return db.DB.Create(job).Error
}

func (db *Database) GetJobByID(id uint) (*Job, error) {
	var job Job
	if err := db.DB.
		Preload("Company").
		First(&job, id).
		Error; err != nil {
		return nil, err
	}
	return &job, nil
}

func (db *Database) GetJobBySlug(slug string) (*Job, error) {
	logger.Info.Println("Getting job by slug:", slug)
	var job Job
	if err := db.DB.
		Where("is_deleted = ? AND slug = ?", false, slug).
		Preload("Company").
		Find(&job).
		Error; err != nil {
		return nil, err
	}
	return &job, nil
}

func (db *Database) DeleteAllJobs() error {
	now := time.Now()
	return db.DB.
		Model(&Job{}).
		Where("is_deleted = ?", false).
		Updates(map[string]interface{}{
			"deleted_at": now,
			"is_deleted": true,
		}).Error
}

func (db *Database) GetAllActiveJobsByCat() ([]Category, error) {
	var categories []Category
	err := db.DB.
		Preload("Jobs", "is_deleted = ?", false).
		Preload("Jobs.Company").
		Find(&categories).
		Error
	if err != nil {
		return nil, err
	}
	return categories, nil
}

func (db *Database) GetAllJobsByCatID(catID uint) ([]Job, error) {
	var jobs []Job
	err := db.DB.
		Where("is_deleted = ? AND category_id = ?", false, catID).
		Preload("Company").
		Preload("Category").
		Find(&jobs).
		Error
	if err != nil {
		return nil, err
	}
	return jobs, nil
}

func (db *Database) IncrementApplicant(slug string) error {
	var applicant Applicant
	err := db.DB.Where("slug = ?", slug).First(&applicant).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Handle the case where the record doesn't exist
			// For example, you can create a new record with the given slug and set the application count to 1
			newApplicant := Applicant{
				Slug:        slug,
				Application: 1,
			}
			err = db.DB.Create(&newApplicant).Error
			if err != nil {
				return err
			}
			return nil
		}
		return err
	}

	// Update the existing record by incrementing the application count
	err = db.DB.Model(&applicant).
		UpdateColumn("application", gorm.Expr("application + ?", 1)).
		Error
	if err != nil {
		return err
	}
	return nil
}

func (db *Database) GetApplication(slug string) (*Applicant, error) {
	var applicant Applicant
	err := db.DB.
		Where("slug = ?", slug).
		Find(&applicant).
		Error
	if err != nil {
		return nil, err
	}
	return &applicant, nil
}

// Category Operations
//
// These functions provide operations related to managing category entities.
// They allow creating, retrieving, deleting, and listing categories in the database.
// The category entities represent specific categories or classifications.
//
// Assumptions:
// - The database connection is established and available via the 'db' object.
//
// Usage:
// - Create a new category: CreateCategory(category *Category) error
// - Retrieve a category by ID: GetCategoryByID(id uint) (*Category, error)
// - Retrieve a category by title: GetCategoryByName(name string) (*Category, error)

func (db *Database) CreateCategory(category *Category) error {
	return db.DB.
		Create(category).
		Error
}

func (db *Database) GetCategoryByID(id uint) (*Category, error) {
	var category Category
	if err := db.DB.First(&category, id).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func (db *Database) GetCategoryByName(name string) (*Category, error) {
	var category Category
	if err := db.DB.Where("name = ?", name).First(&category).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

// Company Operations
//
// These functions provide operations related to managing company entities.
// They allow creating, retrieving, deleting, and listing companies in the database.
// The company entities represent specific companies or organizations.
//
// Assumptions:
// - The database connection is established and available via the 'db' object.
//
// Usage:
// - Create a new company: CreateCompany(company *Company) error
// - Retrieve a company by ID: GetCompanyByID(id uint) (*Company, error)
// - Retrieve a company by name: GetCompanyByName(name string) (*Company, error)

func (db *Database) CreateCompany(company *Company) error {
	return db.DB.Create(company).Error
}

func (db *Database) GetCompanyByID(id uint) (*Company, error) {
	var company Company
	if err := db.DB.First(&company, id).Error; err != nil {
		return nil, err
	}
	return &company, nil
}

func (db *Database) GetCompanyByName(name string) (*Company, error) {
	var company Company
	if err := db.DB.Where("name = ?", name).First(&company).Error; err != nil {
		return nil, err
	}
	return &company, nil
}

// Source Operations
//
// These functions provide operations related to managing Source entities.
//
// Assumptions:
// - The database connection is established and available via the 'db' object.
//
// Usage:
// - Get all source by type: GetAllSource(type string) (*Source, error)
// - Create initial sources to db: CreateInitialSource()

func (db *Database) GetAllSourceByType(typ string) (*[]Source, error) {
	var source []Source
	if err := db.DB.Where("type = ?", typ).Find(&source).Error; err != nil {
		return nil, err
	}
	return &source, nil
}

func (db *Database) CreateInitialSource() error {
	// Check if there are any existing records in the table
	var count int64
	if err := db.DB.Model(&Source{}).Count(&count).Error; err != nil {
		return err
	}

	// If there are existing records skip seeding
	if count > 0 {
		logger.Info.Println("Skipping initial data seeding for Source model, they are already exist")
		return nil
	}

	// Retrieve the initial data from .env variable
	rssLink := os.Getenv("RSS_LINKS")
	links := strings.Split(rssLink, ", ")

	// Create the sources based on the retrieved links
	sources := make([]Source, len(links))
	for i, link := range links {
		sources[i] = Source{
			Type: "RSS",
			Url:  link,
		}
	}

	for _, source := range sources {
		// Save each source record to the db
		if err := db.DB.Create(&source).Error; err != nil {
			return err
		}
	}

	return nil
}
