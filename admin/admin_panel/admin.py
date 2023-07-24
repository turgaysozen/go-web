from django.contrib import admin
from .models import Category, Company, Job, Source, Applicant


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    pass


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(is_deleted=False)
    

@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    pass


@admin.register(Applicant)
class ApplicantAdmin(admin.ModelAdmin):
    pass