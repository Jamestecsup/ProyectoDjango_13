from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    list_filter = ("name",)
    search_fields = ("name", "description")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "price", "stock")
    list_filter = ("category", "stock")
    search_fields = ("name", "description", "category__name")
    list_select_related = ("category",)
