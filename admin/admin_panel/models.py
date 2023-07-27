from django.db import models


class Category(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    link = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    language = models.TextField(blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'categories'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"{self.id} - {self.name}"


class Company(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    headquarter = models.TextField(blank=True, null=True)
    web_site = models.TextField(blank=True, null=True)
    logo = models.TextField(blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'companies'
        verbose_name_plural = 'Companies'

    def __str__(self):
        return f"{self.id} - {self.name}"


class Job(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    slug = models.TextField(blank=True, null=True)
    region = models.TextField(blank=True, null=True)
    type = models.TextField(blank=True, null=True)
    pub_date = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    apply_url = models.TextField(blank=True, null=True)
    salary = models.TextField(blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True)
    source = models.ForeignKey('Source', models.DO_NOTHING, blank=True, null=True)
    company = models.ForeignKey(Company, models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'jobs'

    def __str__(self):
        return f"{self.id} - {self.title}"


class Source(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    type = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sources'

    def __str__(self):
        return f"{self.id} - {self.url}"
    

class Applicant(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    slug = models.TextField(blank=True, null=True)
    application = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'applicants'

    def __str__(self):
        return f"{self.id} - {self.slug} | {self.application}"
