from django.contrib import admin
from .models import Categories, Companies, Jobs, Sources, Applicants


@admin.register(Categories)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Companies)
class CompanyAdmin(admin.ModelAdmin):
    pass


@admin.register(Jobs)
class JobAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(is_deleted=False)
    

@admin.register(Sources)
class SourceAdmin(admin.ModelAdmin):
    pass


@admin.register(Applicants)
class ApplicantAdmin(admin.ModelAdmin):
    pass