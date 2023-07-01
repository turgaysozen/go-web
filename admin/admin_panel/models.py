from django.db import models


class Categories(models.Model):
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

    # class Meta:
    #     verbose_name_plural = 'Category'

    def __str__(self):
        return f"{self.id} - {self.name}"


class Companies(models.Model):
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

    # class Meta:
    #     verbose_name_plural = 'Company'

    def __str__(self):
        return f"{self.id} - {self.name}"


class Jobs(models.Model):
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
    applicant = models.BigIntegerField(blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True)
    source = models.ForeignKey('Sources', models.DO_NOTHING, blank=True, null=True)
    company = models.ForeignKey(Companies, models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Categories, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'jobs'

    # class Meta:
    #     verbose_name_plural = 'Jobs'

    def __str__(self):
        return f"{self.id} - {self.title}"


class Sources(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    type = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sources'
    
    # class Meta:
    #     verbose_name_plural = 'Source'

    def __str__(self):
        return f"{self.id} - {self.url}"
    

class Applicants(models.Model):
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
